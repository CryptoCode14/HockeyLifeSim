//
//  GameManager.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import Foundation
import SwiftUI

enum GameFlowState: String, Codable {
    case creatingPlayer, selectingSchool, inGame
}

@MainActor
class GameManager: ObservableObject {
    
    // --- CORE GAME STATE & PLAYER DATA (UNCHANGED) ---
    struct GameState: Codable {
        var player: Player
        var currentDate: Date
        var gameFlowState: GameFlowState
        var seasonSchedule: GameSchedule?
    }
    
    @Published var gameFlowState: GameFlowState = .creatingPlayer
    @Published var player: Player
    @Published var currentDate: Date
    @Published var seasonSchedule: GameSchedule?
    @Published var monthlySchedule: [Date: Player.ActivityType] = [:]
    
    // --- SIMULATION PROPERTIES (MODIFIED) ---
    @Published var isShowingLiveGame = false
    @Published var activeGameScene: GameScene? // REPLACES activeGameLog
     
    // --- CAREER & EVENT DATA (UNCHANGED) ---
    let storeItems: [LifestyleItem]
    @Published var availablePaths: [Player.League] = []
    @Published var activeEvent: GameEvent?
    @Published var isDraftDay: Bool = false
    private var eventLibrary: [GameEvent] = []
    var weeklyTrainingFocus: [Player.Skill] = []
     
    init() {
        self.storeItems = Self.setupStoreItems()
       
        if let gameState = Self.loadGame() {
            self.player = gameState.player
            self.currentDate = gameState.currentDate
            self.gameFlowState = gameState.gameFlowState
            self.seasonSchedule = gameState.seasonSchedule
            if self.gameFlowState != .inGame { self.gameFlowState = .creatingPlayer }
        } else {
            self.player = Player(firstName: "", lastName: "")
            self.currentDate = {
                var c = DateComponents(); c.year = 2025; c.month = 8; c.day = 15
                return Calendar.current.date(from: c) ?? Date()
            }()
            self.gameFlowState = .creatingPlayer
        }
        setupEvents()
    }
     
    // --- SIMULATION LAUNCH LOGIC (MODIFIED) ---

    private func simulateGame(atIndex index: Int) {
        guard let gameToPlay = seasonSchedule?.games[index],
              let playerTeamInfo = getPlayerTeamInfo() else { return }

        // 1. Create a new GameScene with the correct teams.
        let scene = GameScene(homeTeam: playerTeamInfo, awayTeam: gameToPlay.opponent)
        
        // 2. Start the physics simulation loop.
        scene.start()
        
        // 3. Set the scene as active and trigger the LiveGameView to appear.
        self.activeGameScene = scene
        self.isShowingLiveGame = true
        
        // We can mark the game as "played" here or after it concludes.
        seasonSchedule?.games[index].wasPlayed = true
    }
    
    // NEW: Function to safely end the simulation.
    func endGame() {
        activeGameScene?.stop()
        activeGameScene = nil
        isShowingLiveGame = false
        
        // Check for injury after game
        checkForInjury()
        
        // Reduce energy after game
        player.energy = max(0, player.energy - 15)
    }

    func getPlayerTeamInfo() -> TeamInfo? {
        DatabaseManager.shared.getTeamWith(id: Int64(player.teamId))
    }
     
    // --- ALL OTHER CAREER/PLAYER FUNCTIONS ARE PRESERVED (UNCHANGED) ---
     
    func generateMonthlySchedule() {
        var schedule: [Date: Player.ActivityType] = [:]
        let calendar = Calendar.current
        guard let monthInterval = calendar.dateInterval(of: .month, for: currentDate) else { return }
       
        var day = monthInterval.start
        while day < monthInterval.end {
            let weekday = calendar.component(.weekday, from: day)
            switch weekday {
            case 2...6: schedule[day] = .school; case 7: schedule[day] = .game; case 1: schedule[day] = .rest; default: break
            }
            if let nextDay = calendar.date(byAdding: .day, value: 1, to: day) { day = nextDay } else { break }
        }
    }

    private static func getSaveURL() -> URL? {
        guard let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else { return nil }
        return url.appendingPathComponent("hockeylifesim.json")
    }

    private func saveGame() {
        guard let url = Self.getSaveURL() else { return }
        let gameState = GameState(player: player, currentDate: currentDate, gameFlowState: gameFlowState, seasonSchedule: seasonSchedule)
        do { let data = try JSONEncoder().encode(gameState); try data.write(to: url) } catch { print("Could not save game: \(error)") }
    }

    private static func loadGame() -> GameState? {
        guard let url = getSaveURL(), FileManager.default.fileExists(atPath: url.path) else { return nil }
        do { let data = try Data(contentsOf: url); return try JSONDecoder().decode(GameState.self, from: data) } catch { print("Could not load game: \(error)"); return nil }
    }
     
    func setupNewPlayer(firstName: String, lastName: String) {
        self.player = Player(firstName: firstName, lastName: lastName)
        self.gameFlowState = .selectingSchool
    }
     
    func selectTeam(teamID: Int, teamName: String) {
        self.player.teamName = teamName; self.player.teamId = teamID; self.player.currentLeague = .highSchool
        self.gameFlowState = .inGame; startNewSeason(); saveGame()
    }
     
    func advanceOneWeek() {
        guard !isShowingLiveGame else { return }
        let oldDate = currentDate
        var simulatedGameThisWeek = false
        if let newDate = Calendar.current.date(byAdding: .day, value: 7, to: currentDate) {
            // Handle injury recovery
            if player.currentInjury != nil {
                player.recoverFromInjury(weeks: 1)
            }
            
            // Only play game if not injured
            if !player.isInjured, let nextGameIndex = seasonSchedule?.games.firstIndex(where: { !$0.wasPlayed && ($0.gameDate >= oldDate && $0.gameDate < newDate) }) {
                simulateGame(atIndex: nextGameIndex)
                simulatedGameThisWeek = true
            }
            currentDate = newDate
        }
        if !simulatedGameThisWeek { applyTrainingAndAtrophy() }
        
        // Restore energy gradually
        player.energy = min(100, player.energy + 10)
        
        let currentYear = Calendar.current.component(.year, from: currentDate)
        if player.draftEligibilityYear == currentYear && player.draftDetails == nil { updateScoutingReport() }
        if Calendar.current.component(.day, from: currentDate) <= 7 { processPayday() }
        if Calendar.current.isDate(currentDate, equalTo: player.getBirthday(), toGranularity: .day) { player.age += 1 }
        let oldMonth = Calendar.current.component(.month, from: oldDate); let currentMonth = Calendar.current.component(.month, from: currentDate)
        if oldMonth == 4 && currentMonth == 5 { endSeason() }
        checkForRandomEvent(); saveGame()
    }
     
    private func startNewSeason() {
        player.gamesPlayed = 0; player.goals = 0; player.assists = 0; player.pim = 0; player.plusMinus = 0
        player.shotsOnGoal = 0; player.hits = 0; player.blockedShots = 0
        guard let playerTeam = getPlayerTeamInfo() else { return }
        let seasonStartDate: Date = {
            var c = DateComponents(); c.year = Calendar.current.component(.year, from: currentDate); c.month = 9; c.day = 5
            return Calendar.current.date(from: c) ?? Date()
        }()
        let leagueId: Int64
        switch player.currentLeague {
        case .highSchool: leagueId = 9; case .juniorA: leagueId = 8; case .juniorAAA: leagueId = 4
        case .collegeD1: leagueId = 7; case .collegeD3: leagueId = 8; case .proAHL: leagueId = 2; case .proNHL: leagueId = 1
        }
        self.seasonSchedule = ScheduleGenerator.generate(for: playerTeam, in: leagueId, seasonStartDate: seasonStartDate)
    }
     
    private func endSeason() {
        checkForAwards()
        let currentYear = Calendar.current.component(.year, from: currentDate)
        if player.draftEligibilityYear == currentYear && player.draftDetails == nil { isDraftDay = true }
        else if player.currentLeague == .highSchool && player.age >= 18 {
            let ppg = Double(player.points) / Double(player.gamesPlayed > 0 ? player.gamesPlayed : 1)
            var potentialOffers: [Player.League] = []
            if ppg >= 1.5 { potentialOffers.append(.collegeD1); potentialOffers.append(.juniorAAA) }
            else if ppg >= 0.75 { potentialOffers.append(.collegeD3); potentialOffers.append(.juniorA) }
            self.availablePaths = potentialOffers
        } else { startNewSeason() }
    }
     
    func selectCareerPath(league: Player.League) {
        player.currentLeague = league; availablePaths = []
        let leagueId: Int64
        switch league {
        case .juniorA, .collegeD3: leagueId = 8; case .juniorAAA, .collegeD1: leagueId = 4; default: leagueId = 9
        }
        if let newTeam = DatabaseManager.shared.getTeamsForLeague(id: leagueId).randomElement() {
            player.teamId = Int(newTeam.id); player.teamName = newTeam.name
        }
        startNewSeason()
    }
     
    private func applyTrainingAndAtrophy() { applyTraining(); applyAtrophy() }
    private func applyTraining() {
        for skillToTrain in weeklyTrainingFocus {
            guard let currentSkillValue = player.skills[skillToTrain] else { continue }
            let learningRate = player.age < 22 ? 1.0 : 0.5
            player.skills[skillToTrain] = min(99, currentSkillValue + Int(learningRate))
        }
        weeklyTrainingFocus = []
    }
    private func applyAtrophy() {
        for skill in Player.Skill.allCases {
            if !weeklyTrainingFocus.contains(skill) && !player.maintainedSkills.contains(skill) && Int.random(in: 1...4) == 1 {
                player.skills[skill] = max(20, (player.skills[skill] ?? 21) - 1)
            }
        }
    }
    private func updateScoutingReport() {
        let ppg = Double(player.points) / Double(player.gamesPlayed > 0 ? player.gamesPlayed : 1); let skating = player.skills[.skating] ?? 0; let hockeyIQ = player.skills[.hockeyIQ] ?? 0
        let scoutScore = (ppg * 40) + Double(skating) + Double(hockeyIQ)
        if scoutScore > 150 { player.scoutingReport = "Projected 1st Round Pick" }
        else if scoutScore > 120 { player.scoutingReport = "Projected 2nd-3rd Round Pick" }
        else if scoutScore > 90 { player.scoutingReport = "Projected 4th-7th Round Pick" }
        else { player.scoutingReport = "Likely to go undrafted." }
    }
    private func checkForRandomEvent() {
        if Int.random(in: 1...4) == 1 && !eventLibrary.isEmpty { self.activeEvent = eventLibrary.randomElement() }
    }
    
    private func checkForInjury() {
        // Injury risk based on conditioning and existing injury history
        let conditioning = player.skills[.conditioning] ?? 50
        let baseRisk = 5 // 5% base risk per game
        let conditioningBonus = (conditioning - 50) / 10 // Better conditioning reduces risk
        let injuryHistoryPenalty = min(player.injuryHistory.count * 2, 10)
        
        let totalRisk = max(1, baseRisk - conditioningBonus + injuryHistoryPenalty)
        
        if Int.random(in: 1...100) <= totalRisk {
            // Determine injury severity
            let roll = Int.random(in: 1...100)
            let injury: Player.Injury
            
            if roll <= 60 {
                // Minor injury (60% of injuries)
                let descriptions = ["Bruised shoulder", "Twisted ankle", "Minor cut", "Muscle strain"]
                injury = Player.Injury(
                    type: .minor,
                    description: descriptions.randomElement()!,
                    weeksRemaining: Int.random(in: 1...2),
                    skillImpact: [.skating: 5, .strength: 3]
                )
            } else if roll <= 85 {
                // Moderate injury (25% of injuries)
                let descriptions = ["Sprained wrist", "Pulled groin", "Concussion (mild)", "Bruised ribs"]
                injury = Player.Injury(
                    type: .moderate,
                    description: descriptions.randomElement()!,
                    weeksRemaining: Int.random(in: 3...6),
                    skillImpact: [.skating: 10, .shootingPower: 8, .strength: 10]
                )
            } else if roll <= 95 {
                // Major injury (10% of injuries)
                let descriptions = ["Broken finger", "Separated shoulder", "Knee sprain", "Concussion"]
                injury = Player.Injury(
                    type: .major,
                    description: descriptions.randomElement()!,
                    weeksRemaining: Int.random(in: 8...12),
                    skillImpact: [.skating: 15, .shootingPower: 12, .strength: 15, .checking: 10]
                )
            } else {
                // Season-ending injury (5% of injuries)
                let descriptions = ["Torn ACL", "Broken leg", "Severe concussion", "Torn labrum"]
                injury = Player.Injury(
                    type: .seasonEnding,
                    description: descriptions.randomElement()!,
                    weeksRemaining: Int.random(in: 20...30),
                    skillImpact: [.skating: 25, .shootingPower: 20, .strength: 20, .checking: 15, .conditioning: 20]
                )
            }
            
            player.applyInjury(injury)
        }
    }
    
    private func checkForAwards() {
        guard player.gamesPlayed >= 20 else { return }
        
        let ppg = Double(player.points) / Double(player.gamesPlayed)
        let currentYear = Calendar.current.component(.year, from: currentDate)
        
        // Check for scoring leader award
        if ppg >= 1.5 && player.currentLeague != .highSchool {
            let award = Player.Award(
                id: UUID().uuidString,
                name: "Scoring Leader",
                year: currentYear,
                description: "Led the league in points per game (\(String(format: "%.2f", ppg)) PPG)"
            )
            player.awards.append(award)
            player.morale = min(100, player.morale + 20)
        }
        
        // Check for All-Star selection
        if ppg >= 1.2 && !player.isAllStar && [.collegeD1, .proAHL, .proNHL].contains(player.currentLeague) {
            player.isAllStar = true
            let award = Player.Award(
                id: UUID().uuidString,
                name: "All-Star Selection",
                year: currentYear,
                description: "Selected to the All-Star team"
            )
            player.awards.append(award)
            player.morale = min(100, player.morale + 15)
        }
    }
    private func setupEvents() {
        let event1 = GameEvent(title: "Team Hangout", description: "Your teammates invite you to hang out after practice. This could help build chemistry.", options: [
            EventOption(text: "Go", consequence: { $0.player.relationships.teammates += 5; $0.player.morale += 5 }),
            EventOption(text: "Rest", consequence: { $0.player.relationships.teammates -= 2; $0.player.energy += 5 })
        ])
        
        let event2 = GameEvent(title: "Media Interview", description: "A local sports reporter wants to interview you about your performance.", options: [
            EventOption(text: "Accept", consequence: { $0.player.morale += 3; $0.player.relationships.management += 3 }),
            EventOption(text: "Decline", consequence: { $0.player.relationships.management -= 2 })
        ])
        
        let event3 = GameEvent(title: "Extra Practice", description: "The coach offers you extra ice time to work on your skills.", options: [
            EventOption(text: "Accept", consequence: { $0.weeklyTrainingFocus.append(.skating); $0.player.relationships.coach += 5; $0.player.energy -= 10 }),
            EventOption(text: "Decline", consequence: { $0.player.energy += 5; $0.player.relationships.coach -= 3 })
        ])
        
        let event4 = GameEvent(title: "Team Conflict", description: "There's tension in the locker room after a tough loss.", options: [
            EventOption(text: "Mediate", consequence: { $0.player.relationships.teammates += 8; $0.player.morale -= 5 }),
            EventOption(text: "Stay out of it", consequence: { $0.player.relationships.teammates -= 5 })
        ])
        
        let event5 = GameEvent(title: "Off-Ice Training", description: "You have a chance to do specialized off-ice conditioning.", options: [
            EventOption(text: "Attend", consequence: { $0.weeklyTrainingFocus.append(.strength); $0.weeklyTrainingFocus.append(.conditioning); $0.player.energy -= 15 }),
            EventOption(text: "Skip", consequence: { $0.player.energy += 10 })
        ])
        
        let event6 = GameEvent(title: "Family Visit", description: "Your family wants to visit and watch you play.", options: [
            EventOption(text: "Invite them", consequence: { $0.player.relationships.family += 10; $0.player.morale += 10 }),
            EventOption(text: "Not now", consequence: { $0.player.relationships.family -= 5; $0.player.morale -= 3 })
        ])
        
        self.eventLibrary = [event1, event2, event3, event4, event5, event6]
    }
    func processPayday() {
        guard let contract = player.currentContract else { return }; player.bankBalance += contract.annualSalary / 12.0
    }
    private static func setupStoreItems() -> [LifestyleItem] { return [] }
    func purchaseItem(_ item: LifestyleItem) {}
    func offerEntryLevelContract() {}
}
