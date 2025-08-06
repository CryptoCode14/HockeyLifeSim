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
    
    @Published var gameFlowState: GameFlowState = .creatingPlayer
    
    struct GameState: Codable {
        var player: Player
        var currentDate: Date
        var gameFlowState: GameFlowState

        enum CodingKeys: String, CodingKey {
            case player, currentDate, gameFlowState
        }
        
        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            player = try container.decode(Player.self, forKey: .player)
            currentDate = try container.decode(Date.self, forKey: .currentDate)
            gameFlowState = try container.decodeIfPresent(GameFlowState.self, forKey: .gameFlowState) ?? .creatingPlayer
        }
        
        init(player: Player, currentDate: Date, gameFlowState: GameFlowState) {
            self.player = player
            self.currentDate = currentDate
            self.gameFlowState = gameFlowState
        }
    }
    
    @Published var player: Player
    @Published var currentDate: Date
    let storeItems: [LifestyleItem]
    @Published var availablePaths: [Player.League] = []
    @Published var activeEvent: GameEvent?
    @Published var activeMiniGame: Bool = false
    @Published var isDraftDay: Bool = false
    @Published var monthlySchedule: [Date: Player.ActivityType] = [:]
    
    private var eventLibrary: [GameEvent] = []
    private var gamesToSimulateThisWeek: Int = 0
    var weeklyTrainingFocus: [Player.Skill] = []
    
    init() {
        self.storeItems = Self.setupStoreItems()
        
        if let gameState = Self.loadGame() {
            self.player = gameState.player
            self.currentDate = gameState.currentDate
            self.gameFlowState = gameState.gameFlowState
            print("✅ Game loaded successfully! State is \(self.gameFlowState.rawValue)")
            if self.gameFlowState != .inGame {
                self.gameFlowState = .creatingPlayer
            }
        } else {
            self.player = Player(firstName: "", lastName: "")
            self.currentDate = {
                var components = DateComponents(); components.year = 2025; components.month = 8; components.day = 15
                return Calendar.current.date(from: components) ?? Date()
            }()
            self.gameFlowState = .creatingPlayer
            print("⚠️ No save file found. Starting a new game.")
        }
        setupEvents()
    }
    
    func generateMonthlySchedule() {
        var schedule: [Date: Player.ActivityType] = [:]
        let calendar = Calendar.current
        guard let monthInterval = calendar.dateInterval(of: .month, for: currentDate) else { return }
        
        var day = monthInterval.start
        while day < monthInterval.end {
            let weekday = calendar.component(.weekday, from: day)
            switch weekday {
            case 2...6: schedule[day] = .school
            case 7: schedule[day] = .game
            case 1: schedule[day] = .rest
            default: break
            }
            if let nextDay = calendar.date(byAdding: .day, value: 1, to: day) { day = nextDay } else { break }
        }
        
        let daysInMonth = schedule.keys.sorted()
        if daysInMonth.count > 10 {
            schedule[daysInMonth[1]] = .game
            schedule[daysInMonth[2]] = .practice
            schedule[daysInMonth[3]] = .game
            schedule[daysInMonth[4]] = .practice
        }
        self.monthlySchedule = schedule
        print("🗓️ Generated realistic schedule for \(currentDate.formatted(date: .abbreviated, time: .omitted)) with \(schedule.count) days.")
    }

    func setupNewPlayer(firstName: String, lastName: String) {
        self.player = Player(firstName: firstName, lastName: lastName)
        self.gameFlowState = .selectingSchool
    }
    
    func selectTeam(teamID: Int, teamName: String) {
        self.player.teamName = teamName
        self.player.currentLeague = .highSchool
        self.player.age = 14
        self.currentDate = {
            var components = DateComponents(); components.year = 2025; components.month = 8; components.day = 15
            return Calendar.current.date(from: components) ?? Date()
        }()
        self.gameFlowState = .inGame
        saveGame()
    }

    private static func getSaveURL() -> URL? {
        guard let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else { return nil }
        return url.appendingPathComponent("hockeylifesim.json")
    }

    private func saveGame() {
        guard let url = Self.getSaveURL() else { return }
        let gameState = GameState(player: player, currentDate: currentDate, gameFlowState: gameFlowState)
        do { let data = try JSONEncoder().encode(gameState); try data.write(to: url); print("✅ Game saved!") } catch { print("❌ Could not save game: \(error)") }
    }

    private static func loadGame() -> GameState? {
        guard let url = getSaveURL(), FileManager.default.fileExists(atPath: url.path) else { return nil }
        do { let data = try Data(contentsOf: url); let gameState = try JSONDecoder().decode(GameState.self, from: data); return gameState } catch { print("❌ Could not load game: \(error)"); return nil }
    }

    func advanceOneWeek() {
        let oldDate = currentDate
        if let newDate = Calendar.current.date(byAdding: .day, value: 7, to: currentDate) { currentDate = newDate }
        let currentYear = Calendar.current.component(.year, from: currentDate)
        if player.draftEligibilityYear == currentYear && player.draftDetails == nil { updateScoutingReport() }
        if Calendar.current.component(.day, from: currentDate) <= 7 { processPayday() }
        let currentMonth = Calendar.current.component(.month, from: currentDate)
        let isHockeySeason = (currentMonth >= 9 && currentMonth <= 12) || (currentMonth >= 1 && currentMonth <= 4)
        if isHockeySeason { gamesToSimulateThisWeek = 2; simulateNextGame() } else { applyTrainingAndAtrophy() }
        if Calendar.current.isDate(currentDate, equalTo: player.getBirthday(), toGranularity: .day) { player.age += 1 }
        let oldMonth = Calendar.current.component(.month, from: oldDate)
        if oldMonth == 4 && currentMonth == 5 { endSeason() }
        checkForRandomEvent()
        saveGame()
    }

    func resolveMiniGame(didSucceed: Bool) {
        if didSucceed { player.goals += 1 }
        activeMiniGame = false
        simulateNextGame()
    }

    private func simulateNextGame() {
        if gamesToSimulateThisWeek > 0 {
            player.gamesPlayed += 1; gamesToSimulateThisWeek -= 1
            if Int.random(in: 1...3) == 1 { activeMiniGame = true } else { simulateNextGame() }
        } else { applyTrainingAndAtrophy() }
    }

    private func checkForRandomEvent() { if Int.random(in: 1...4) == 1 && !eventLibrary.isEmpty { self.activeEvent = eventLibrary.randomElement() } }
    private func applyTrainingAndAtrophy() { applyTraining(); applyAtrophy() }

    private func endSeason() {
        let currentYear = Calendar.current.component(.year, from: currentDate)
        if player.draftEligibilityYear == currentYear && player.draftDetails == nil {
            isDraftDay = true
        } else if player.currentLeague == .highSchool && player.age >= 18 {
            let ppg = Double(player.points) / Double(player.gamesPlayed > 0 ? player.gamesPlayed : 1)
            var potentialOffers: [Player.League] = []
            if ppg >= 1.5 { potentialOffers.append(.collegeD1); potentialOffers.append(.juniorAAA) }
            else if ppg >= 0.75 { potentialOffers.append(.collegeD3); potentialOffers.append(.juniorA) }
            self.availablePaths = potentialOffers
        } else { player.gamesPlayed = 0; player.goals = 0; player.assists = 0 }
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

    private func setupEvents() {
        let event1 = GameEvent(title: "Team Hangout", description: "Some teammates are going for pizza after a tough practice...", options: [EventOption(text: "Go for pizza", consequence: { $0.player.relationships.teammates += 5 }), EventOption(text: "Go home and rest", consequence: { $0.player.relationships.teammates -= 2 })])
        let event2 = GameEvent(title: "Coach's Feedback", description: "The coach pulls you aside to criticize your defensive play...", options: [EventOption(text: "Accept criticism gracefully", consequence: { $0.player.relationships.coach += 5; $0.player.skills[.hockeyIQ]? += 1 }), EventOption(text: "Argue your point", consequence: { $0.player.relationships.coach -= 10 })])
        self.eventLibrary = [event1, event2]
    }

    func processPayday() {
        guard let contract = player.currentContract else { return }
        let monthlyPay = contract.annualSalary / 12.0
        player.bankBalance += monthlyPay
    }

    private static func setupStoreItems() -> [LifestyleItem] {
        return [ LifestyleItem(id: "skates1", name: "Pro-Stock Skates", cost: 5000, bonus: ItemBonus(skill: .skating, value: 1, description: "+1 Skating")), LifestyleItem(id: "gym1", name: "Home Gym Setup", cost: 25000, bonus: ItemBonus(skill: .strength, value: 1, description: "+1 Strength")), LifestyleItem(id: "nutrition1", name: "Personalized Nutrition Plan", cost: 50000, bonus: ItemBonus(skill: .conditioning, value: 2, description: "+2 Conditioning")), LifestyleItem(id: "video1", name: "Advanced Video Analysis Software", cost: 15000, bonus: ItemBonus(skill: .hockeyIQ, value: 1, description: "+1 Hockey IQ")) ]
    }

    func purchaseItem(_ item: LifestyleItem) {
        guard player.bankBalance >= item.cost, !player.ownedItemIDs.contains(item.id) else { return }
        player.bankBalance -= item.cost
        player.ownedItemIDs.append(item.id)
        if let skillToBoost = item.bonus.skill {
            if let currentValue = player.skills[skillToBoost] { player.skills[skillToBoost] = min(99, currentValue + item.bonus.value) }
        }
        saveGame()
    }

    func offerEntryLevelContract() {
        guard let draftDetails = player.draftDetails else { return }
        let salary = draftDetails.round == 1 ? 950000.0 : 850000.0
        let contractOfferEvent = GameEvent(title: "Entry-Level Contract Offer", description: "The \(draftDetails.teamName) have offered you a standard 3-year entry-level contract...", options: [EventOption(text: "Sign the contract", consequence: { gameManager in let newContract = Player.Contract(teamName: draftDetails.teamName, yearsRemaining: 3, annualSalary: salary); gameManager.player.currentContract = newContract; gameManager.player.currentLeague = .proNHL; gameManager.player.teamName = draftDetails.teamName }), EventOption(text: "Decline & return to juniors/college", consequence: { gameManager in })])
        self.activeEvent = contractOfferEvent
    }

    func selectCareerPath(league: Player.League) {
        player.currentLeague = league
        switch league {
        case .collegeD1: player.teamName = "Denver Pioneers"
        case .juniorAAA: player.teamName = "Kelowna Rockets"
        case .collegeD3: player.teamName = "Aurora Spartans"
        case .juniorA: player.teamName = "Brooks Bandits"
        default: player.teamName = "Unassigned"
        }
        player.gamesPlayed = 0; player.goals = 0; player.assists = 0; availablePaths = []
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
            let wasTrained = weeklyTrainingFocus.contains(skill)
            let isMaintained = player.maintainedSkills.contains(skill)
            if !wasTrained && !isMaintained {
                if Int.random(in: 1...4) == 1 {
                    guard let currentSkillValue = player.skills[skill] else { continue }
                    let newSkillValue = max(20, currentSkillValue - 1)
                    player.skills[skill] = newSkillValue
                }
            }
        }
    }
}
