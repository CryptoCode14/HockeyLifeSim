//
//  MainGameView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import SwiftUI

struct MainGameView: View {
    @EnvironmentObject var gameManager: GameManager
    @State private var isShowingScheduleView = false
    @State private var isShowingLifestyleView = false
    
    private var isShowingEndOfSeasonView: Binding<Bool> {
        Binding(get: { !gameManager.availablePaths.isEmpty }, set: { _ in })
    }
    
    init() {}
    
    var body: some View {
        NavigationView {
            VStack {
                HeaderView()
                List {
                    FinanceView(player: gameManager.player)
                    
                    let currentYear = Calendar.current.component(.year, from: gameManager.currentDate)
                    if gameManager.player.draftEligibilityYear == currentYear && gameManager.player.draftDetails == nil {
                        Section(header: Text("Draft Outlook")) { Text(gameManager.player.scoutingReport).font(.headline) }
                    }
                    
                    SeasonStatsView(player: gameManager.player)
                    RelationshipsView(relationships: gameManager.player.relationships)
                    PlayerSkillsView(skills: gameManager.player.skills)
                }
                
                HStack {
                    Button("Simulate Week") { gameManager.advanceOneWeek() }
                        .font(.headline).fontWeight(.bold).frame(maxWidth: .infinity).padding().background(Color.blue).foregroundColor(.white).cornerRadius(10)
                    
                    Button("Lifestyle") { isShowingLifestyleView = true }
                        .font(.headline).fontWeight(.bold).frame(maxWidth: .infinity).padding().background(Color.green).foregroundColor(.white).cornerRadius(10)
                }
                .padding(.horizontal)
                .padding(.bottom)
            }
            .navigationTitle("Hockey Life Sim").navigationBarHidden(true)
            .sheet(isPresented: $isShowingScheduleView) { WeeklyScheduleView() }
            .sheet(isPresented: isShowingEndOfSeasonView) { EndOfSeasonView() }
            .sheet(item: $gameManager.activeEvent) { event in
                EventView(event: event, onComplete: { chosenOption in
                    chosenOption.consequence(gameManager)
                    gameManager.activeEvent = nil
                }).interactiveDismissDisabled()
            }
            .sheet(isPresented: $isShowingLifestyleView) {
                LifestyleView(player: gameManager.player, items: gameManager.storeItems, onPurchase: { item in gameManager.purchaseItem(item) })
            }
            .fullScreenCover(isPresented: $gameManager.isDraftDay) { DraftDayView() }
            .fullScreenCover(isPresented: $gameManager.isShowingLiveGame) {
                if gameManager.activeGameScene != nil {
                    LiveGameView().environmentObject(gameManager)
                } else {
                    VStack {
                        Text("Error loading game...")
                        Button("Dismiss") { gameManager.endGame() }
                    }
                }
            }
        }
    }
}

// --- Helper views below this are unchanged ---

struct HeaderView: View {
    @EnvironmentObject var gameManager: GameManager
    
    var body: some View {
        VStack {
            Text(gameManager.currentDate.formatted(date: .abbreviated, time: .omitted)).font(.headline).foregroundColor(.secondary)
            Text("\(gameManager.player.firstName) \(gameManager.player.lastName)").font(.largeTitle).fontWeight(.bold)
            let leagueText = gameManager.player.draftDetails?.teamName ?? gameManager.player.teamName
            let leagueSubtext = gameManager.player.draftDetails != nil ? "Prospect" : gameManager.player.currentLeague.rawValue
            Text("Age: \(gameManager.player.age) | \(leagueText) (\(leagueSubtext))").font(.subheadline).padding(.bottom)
        }
    }
}

struct FinanceView: View {
    let player: Player
    private var currencyFormatter: NumberFormatter {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.maximumFractionDigits = 0
        return f
    }
    
    var body: some View {
        Section(header: Text("Finances")) {
            HStack {
                Text("Bank Balance")
                Spacer()
                Text(currencyFormatter.string(from: NSNumber(value: player.bankBalance)) ?? "$0").fontWeight(.bold).foregroundColor(.green)
            }
            if let contract = player.currentContract {
                HStack {
                    Text("Salary")
                    Spacer()
                    Text("\(currencyFormatter.string(from: NSNumber(value: contract.annualSalary)) ?? "$0") / yr").foregroundColor(.secondary)
                }
            }
        }
    }
}

struct SeasonStatsView: View {
    let player: Player
    
    var body: some View {
        Section(header: Text("Season Stats")) {
            HStack { Text("Games Played").foregroundColor(.secondary); Spacer(); Text("\(player.gamesPlayed)") }
            HStack { Text("Goals"); Spacer(); Text("\(player.goals)").fontWeight(.bold) }
            HStack { Text("Assists"); Spacer(); Text("\(player.assists)").fontWeight(.bold) }
            HStack { Text("Points"); Spacer(); Text("\(player.points)").fontWeight(.bold) }
            HStack { Text("PIM"); Spacer(); Text("\(player.pim)").fontWeight(.bold) }
            HStack { Text("+/-"); Spacer(); Text("\(player.plusMinus)").fontWeight(.bold) }
        }
    }
}

struct RelationshipsView: View {
    let relationships: Player.Relationships
    
    var body: some View {
        Section(header: Text("Relationships")) {
            HStack { Text("Coach"); Spacer(); Text("\(relationships.coach)").fontWeight(.semibold) }
            HStack { Text("Teammates"); Spacer(); Text("\(relationships.teammates)").fontWeight(.semibold) }
            HStack { Text("Management"); Spacer(); Text("\(relationships.management)").fontWeight(.semibold) }
            HStack { Text("Family"); Spacer(); Text("\(relationships.family)").fontWeight(.semibold) }
        }
    }
}

struct PlayerSkillsView: View {
    let skills: [Player.Skill: Int]
    
    var body: some View {
        Section(header: Text("Player Skills")) {
            ForEach(skills.keys.sorted(by: { $0.rawValue < $1.rawValue }), id: \.self) { skill in
                HStack { Text(skill.rawValue); Spacer(); Text("\(skills[skill] ?? 0)").fontWeight(.semibold) }
            }
        }
    }
}
