//
//  GameManager.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import Foundation
import SwiftUI

enum GameFlowState: String, Codable {
    case creatingPlayer
    case selectingSchool
    case inGame
}

@MainActor
class GameManager: ObservableObject {
    
    struct GameState: Codable {
        var player: Player
        var currentDate: Date
        var gameFlowState: GameFlowState
        var seasonSchedule: GameSchedule?
    }
    
    // RESTORED: All @Published properties are now correctly included.
    @Published var gameFlowState: GameFlowState = .creatingPlayer
    @Published var player: Player
    @Published var currentDate: Date
    @Published var seasonSchedule: GameSchedule?
    @Published var monthlySchedule: [Date: Player.ActivityType] = [:]

    @Published var isShowingLiveGame = false
    @Published var activeGameLog: GameEventLog?
    
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
    
    // RESTORED: This function is required by MonthlyPlannerView.
    func generateMonthlySchedule() {
        var schedule: [Date: Player.ActivityType] = [:]
        let calendar = Calendar.current
        guard let monthInterval = calendar.dateInterval(of: .month, for: currentDate) else { return }
        
        var day = monthInterval.start
        while day < monthInterval.end {
            let weekday = calendar.component(.weekday, from: day)
            switch weekday {
            case 2...6: schedule[day] = .school // Monday-Friday
            case 7: schedule[day] = .game     // Saturday
            case 1: schedule[day] = .rest      // Sunday
            default: break
            }
            if let nextDay = calendar.date(byAdding: .day, value: 1, to: day) { day = nextDay } else { break }
        }
        
        // Add some variety for practices, etc.
        let daysInMonth = schedule.keys.sorted()
        if daysInMonth.count > 10 {
            if let gameDay = daysInMonth.first(where: { calendar.component(.weekday, from: $0) == 7 }) {
                if let dayBefore = calendar.date(byAdding: .day, value: -1, to: gameDay) {
                     schedule[dayBefore] = .practice
                }
            }
        }
        self.monthlySchedule = schedule
    }

    // --- All other GameManager functions are included below without abbreviation ---
    
    private static func getSaveURL() -> URL? {
        guard let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else { return nil }
        return url.appendingPathComponent("hockeylifesim.json")
    }

    private func saveGame() {
        guard let url = Self.getSaveURL() else { return }
        let gameState = GameState(player: player, currentDate: currentDate, gameFlowState: gameFlowState, seasonSchedule: seasonSchedule)
        do { let data = try JSONEncoder().encode(gameState); try data.write(to: url) } catch { print("❌ Could not save game: \(error)") }
    }

    private static func loadGame() -> GameState? {
        guard let url = getSaveURL(), FileManager.default.fileExists(atPath: url.path) else { return nil }
        do { let data = try Data(contentsOf: url); return try JSONDecoder().decode(GameState.self, from: data) } catch { print("❌ Could not load game: \(error)"); return nil }
    }
    
    func setupNewPlayer(firstName: String, lastName: String) {
        self.player = Player(firstName: firstName, lastName: lastName)
        self.gameFlowState = .selectingSchool
    }
    
    func selectTeam(teamID: Int, teamName: String) {
        self.player.teamName = teamName
        self.player.teamId = teamID
        self.player.currentLeague = .highSchool
        self.gameFlowState = .inGame
        startNewSeason()
        saveGame()
    }
    
    func advanceOneWeek() {
        guard !isShowingLiveGame else { return }
        let oldDate = currentDate
        var simulatedGameThisWeek = false
        if let newDate = Calendar.current.date(byAdding: .day, value: 7, to: currentDate) {
            if let nextGameIndex = seasonSchedule?.games.firstIndex(where: { !$0.wasPlayed && ($0.gameDate >= oldDate && $0.gameDate < newDate) }) {
                simulateGame(atIndex: nextGameIndex)
                simulatedGameThisWeek = true
            }
            currentDate = newDate
        }
        if !simulatedGameThisWeek { applyTrainingAndAtrophy() }
        let currentYear = Calendar.current.component(.year, from: currentDate)
        if player.draftEligibilityYear == currentYear && player.draftDetails == nil { updateScoutingReport() }
        if Calendar.current.component(.day, from: currentDate) <= 7 { processPayday() }
        if Calendar.current.isDate(currentDate, equalTo: player.getBirthday(), toGranularity: .day) { player.age += 1 }
        let oldMonth = Calendar.current.component(.month, from: oldDate)
        let currentMonth = Calendar.current.component(.month, from: currentDate)
        if oldMonth == 4 && currentMonth == 5 { endSeason() }
        checkForRandomEvent()
        saveGame()
    }
    
    private func simulateGame(atIndex index: Int) {
        guard let gameToPlay = seasonSchedule?.games[index],
              let playerTeamInfo = getPlayerTeamInfo() else { return }
        let result = SimulationEngine.shared.simulateGame(player: player, playerTeam: playerTeamInfo, opponent: gameToPlay.opponent)
        player.gamesPlayed += 1
        player.goals += result.playerGoals
        player.assists += result.playerAssists
        player.pim += result.playerPIM
        player.plusMinus += result.playerPlusMinus
        seasonSchedule?.games[index].wasPlayed = true
        seasonSchedule?.games[index].gameResult = result
        self.activeGameLog = result
        self.isShowingLiveGame = true
    }
    
    private func startNewSeason() {
        player.gamesPlayed = 0; player.goals = 0; player.assists = 0; player.pim = 0; player.plusMinus = 0
        guard let playerTeam = getPlayerTeamInfo() else { return }
        let seasonStartDate: Date = {
            var c = DateComponents(); c.year = Calendar.current.component(.year, from: currentDate); c.month = 9; c.day = 5
            return Calendar.current.date(from: c) ?? Date()
        }()
        let leagueId: Int64
        switch player.currentLeague {
        case .highSchool: leagueId = 9
        case .juniorA: leagueId = 8
        case .juniorAAA: leagueId = 4
        case .collegeD1: leagueId = 7
        case .collegeD3: leagueId = 8
        case .proAHL: leagueId = 2
        case .proNHL: leagueId = 1
        }
        self.seasonSchedule = ScheduleGenerator.generate(for: playerTeam, in: leagueId, seasonStartDate: seasonStartDate)
    }
    
    private func endSeason() {
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
    
    private func getPlayerTeamInfo() -> TeamInfo? { DatabaseManager.shared.getTeamWith(id: Int64(player.teamId)) }
    
    func selectCareerPath(league: Player.League) {
        player.currentLeague = league
        availablePaths = []
        let leagueId: Int64
        switch league {
        case .juniorA, .collegeD3: leagueId = 8
        case .juniorAAA, .collegeD1: leagueId = 4
        default: leagueId = 9
        }
        if let newTeam = DatabaseManager.shared.getTeamsForLeague(id: leagueId).randomElement() {
            player.teamId = Int(newTeam.id)
            player.teamName = newTeam.name
        }
        startNewSeason()
    }
    
    private func applyTrainingAndAtrophy() {
        applyTraining()
        applyAtrophy()
    }
    
    private func applyTraining() {
        for skillToTrain in weeklyTrainingFocus {
            guard let currentSkillValue = player.skills[skillToTrain] else { continue }
            let learningRate = player.age < 22 ? 1.0 : 0.5
            let newSkillValue = min(99, currentSkillValue + Int(learningRate))
            player.skills[skillToTrain] = newSkillValue
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
        let ppg = Double(player.points) / Double(player.gamesPlayed > 0 ? player.gamesPlayed : 1)
        let skating = player.skills[.skating] ?? 0
        let hockeyIQ = player.skills[.hockeyIQ] ?? 0
        let scoutScore = (ppg * 40) + Double(skating) + Double(hockeyIQ)
        if scoutScore > 150 { player.scoutingReport = "Projected 1st Round Pick" }
        else if scoutScore > 120 { player.scoutingReport = "Projected 2nd-3rd Round Pick" }
        else if scoutScore > 90 { player.scoutingReport = "Projected 4th-7th Round Pick" }
        else { player.scoutingReport = "Likely to go undrafted." }
    }
    
    private func checkForRandomEvent() {
        if Int.random(in: 1...4) == 1 && !eventLibrary.isEmpty { self.activeEvent = eventLibrary.randomElement() }
    }
    
    private func setupEvents() {
        let event1 = GameEvent(title: "Team Hangout", description: "...", options: [EventOption(text: "Go", consequence: { $0.player.relationships.teammates += 5 }), EventOption(text: "Rest", consequence: { $0.player.relationships.teammates -= 2 })])
        self.eventLibrary = [event1]
    }
    
    func processPayday() {
        guard let contract = player.currentContract else { return }
        player.bankBalance += contract.annualSalary / 12.0
    }

    private static func setupStoreItems() -> [LifestyleItem] { return [] }
    func purchaseItem(_ item: LifestyleItem) {}
    func offerEntryLevelContract() {}
}
