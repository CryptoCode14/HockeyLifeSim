//
//  LiveGameView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import SwiftUI
import Combine

struct LiveGameView: View {
    @Environment(\.dismiss) var dismiss
    let gameLog: GameEventLog
    
    // State to manage the "live" feed
    @State private var visibleEntries: [GameEventLog.LogEntry] = []
    @State private var score: (player: Int, opponent: Int) = (0, 0)
    @State private var timer: AnyCancellable?
    
    var body: some View {
        VStack(spacing: 0) {
            // MARK: Scoreboard
            HStack {
                Text(gameLog.playerTeamName)
                    .font(.headline)
                    .frame(maxWidth: .infinity, alignment: .center)
                
                Text("\(score.player) - \(score.opponent)")
                    .font(.largeTitle.bold())
                    .monospacedDigit()
                
                Text(gameLog.opponentTeamName)
                    .font(.headline)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding()
            .background(.thinMaterial)
            
            // MARK: Play-by-Play Log
            ScrollViewReader { proxy in
                List(visibleEntries) { entry in
                    HStack {
                        Text(entry.time)
                            .font(.caption.monospaced())
                            .frame(width: 50)
                        
                        Text(entry.description)
                            .fontWeight(entry.isGoal ? .bold : .regular)
                            .foregroundColor(entry.isGoal ? .blue : .primary)
                    }
                    .id(entry.id)
                }
                .listStyle(.plain)
                .onChange(of: visibleEntries.count) { _ in
                    // Automatically scroll to the newest event
                    if let lastEntry = visibleEntries.last {
                        withAnimation {
                            proxy.scrollTo(lastEntry.id, anchor: .bottom)
                        }
                    }
                }
            }
        }
        .onAppear(perform: startSimulationFeed)
        .onDisappear(perform: { timer?.cancel() })
        .overlay(alignment: .bottom) {
            Button("Close") {
                dismiss()
            }
            .font(.headline)
            .padding()
            .frame(maxWidth: .infinity)
            .background(.ultraThickMaterial)
        }
    }
    
    private func startSimulationFeed() {
        var entryIndex = 0
        
        // Use a timer to reveal one log entry at a time
        self.timer = Timer.publish(every: 0.5, on: .main, in: .common)
            .autoconnect()
            .sink { _ in
                if entryIndex < gameLog.entries.count {
                    let entry = gameLog.entries[entryIndex]
                    visibleEntries.append(entry)
                    
                    // Update score if it was a goal
                    if entry.isGoal {
                        if entry.isPlayerTeamGoal {
                            score.player += 1
                        } else {
                            score.opponent += 1
                        }
                    }
                    
                    entryIndex += 1
                } else {
                    // All entries shown, cancel the timer
                    timer?.cancel()
                }
            }
    }
}

struct LiveGameView_Previews: PreviewProvider {
    static var previews: some View {
        let sampleLog = GameEventLog(
            playerTeamName: "Sharks",
            opponentTeamName: "Penguins",
            finalPlayerScore: 3,
            finalOpponentScore: 2,
            entries: [
                GameEventLog.LogEntry(period: 1, time: "05:12", description: "Goal by Sharks!", isGoal: true, isPlayerTeamGoal: true),
                GameEventLog.LogEntry(period: 1, time: "10:45", description: "Penalty on Penguins", isGoal: false, isPlayerTeamGoal: false),
                GameEventLog.LogEntry(period: 2, time: "03:33", description: "Goal by Penguins!", isGoal: true, isPlayerTeamGoal: false)
            ],
            playerGoals: 1,
            playerAssists: 0,
            playerPIM: 2,
            playerPlusMinus: 1
        )
        LiveGameView(gameLog: sampleLog)
    }
}
