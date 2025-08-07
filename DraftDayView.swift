//
//  DraftDayView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct DraftDayView: View {
    @EnvironmentObject var gameManager: GameManager
    
    @State private var currentPick = 0
    @State private var picksPerSecond = 50.0
    @State private var draftMessage = "The 1st Round is underway..."
    @State private var draftIsComplete = false
    
    private var playerDraftPick: Int {
        switch gameManager.player.scoutingReport {
        case "Projected 1st Round Pick": return Int.random(in: 1...32)
        case "Projected 2nd-3rd Round Pick": return Int.random(in: 33...96)
        case "Projected 4th-7th Round Pick": return Int.random(in: 97...224)
        default: return 0 // Undrafted
        }
    }
    
    var body: some View {
        VStack(spacing: 30) {
            Text("NHL Entry Draft")
                .font(.largeTitle).bold()
            
            Text(draftMessage)
                .font(.headline)
                .multilineTextAlignment(.center)
            
            Text("Pick #\(currentPick)")
                .font(.system(size: 80, weight: .bold, design: .monospaced))
                .padding()
                .background(.thinMaterial)
                .cornerRadius(20)

            if draftIsComplete {
                Button("Continue Career") {
                    gameManager.isDraftDay = false
                    
                    if gameManager.player.draftDetails != nil {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                            gameManager.offerEntryLevelContract()
                        }
                    }
                }
                .font(.title2).bold()
                .padding()
            }
        }
        .padding()
        .onAppear(perform: startDraftSimulation)
    }
    
    func startDraftSimulation() {
        let finalPick = playerDraftPick
        
        guard finalPick > 0 else {
            draftMessage = "Unfortunately, you were not selected in the draft."
            draftIsComplete = true
            return
        }
        
        Timer.scheduledTimer(withTimeInterval: 1.0 / picksPerSecond, repeats: true) { timer in
            if self.currentPick < finalPick {
                self.currentPick += 1
                
                if finalPick - self.currentPick < 20 {
                    timer.invalidate()
                    picksPerSecond = 5.0
                    startDraftSimulation()
                }
            } else {
                timer.invalidate()
                
                let round = (finalPick / 32) + 1
                let pickInRound = (finalPick - 1) % 32 + 1
                
                // This is a placeholder. In the future, we'll get a real team.
                let team = "Colorado Avalanche"
                
                draftMessage = "With the \(pickInRound)\(pickInRound.ordinalSuffix()) pick in the \(round)\(round.ordinalSuffix()) round, the \(team) select..."
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                    self.draftMessage = "\(gameManager.player.firstName) \(gameManager.player.lastName)!"
                    
                    // FIXED: Changed argument label from 'pick' to 'overallPick'
                    let draftDetails = Player.DraftDetails(year: 2026, teamName: team, round: round, overallPick: finalPick)
                    gameManager.player.draftDetails = draftDetails
                    
                    self.draftIsComplete = true
                }
            }
        }
    }
}
