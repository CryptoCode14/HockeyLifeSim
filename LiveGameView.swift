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
    @EnvironmentObject var gameManager: GameManager
    let gameLog: GameEventLog
    
    @State private var session: LiveGameSession?
    @State private var timer: AnyCancellable?
    
    // FIXED: Game speed is now real-time.
    private let gameSpeed: TimeInterval = 1.0

    var body: some View {
        VStack(spacing: 0) {
            if let currentSession = session {
                ScoreboardView(
                    playerTeamName: String(gameLog.playerTeamName.prefix(3)),
                    opponentTeamName: String(gameLog.opponentTeamName.prefix(3)),
                    playerScore: currentSession.playerScore,
                    opponentScore: currentSession.opponentScore,
                    period: "\(currentSession.period)\(currentSession.period.ordinalSuffix())",
                    clock: formatTime(seconds: currentSession.gameTime),
                    playerSOG: currentSession.playerSOG,
                    opponentSOG: currentSession.opponentSOG,
                    powerPlayTime: nil, isPlayerTeamOnPP: false
                )
                .padding(.horizontal).padding(.vertical, 5).background(Color.black)
                
                GeometryReader { geo in
                    ZStack {
                        Image("hockey_rink")
                            .resizable().scaledToFit()
                            .frame(width: geo.size.width, height: geo.size.height)
                        
                        // DRAW ORDER: Skaters -> Goalies -> Puck (on top)
                        ForEach(currentSession.skaters) { skater in
                            PlayerIconView(player: skater, playerTeamId: Int64(gameManager.player.teamId))
                                .position(scale(eventCoords: skater.position, to: geo.size))
                        }
                        
                        ForEach(currentSession.goalies) { goalie in
                            PlayerIconView(player: goalie, playerTeamId: Int64(gameManager.player.teamId))
                                .position(scale(eventCoords: goalie.position, to: geo.size))
                        }
                        
                        PuckView()
                            .position(scale(eventCoords: currentSession.puck.position, to: geo.size))
                    }
                }
                
                Text(currentSession.description)
                    .font(.caption.bold()).foregroundColor(.white)
                    .frame(height: 40).frame(maxWidth: .infinity)
                    .background(Color.black.opacity(0.7))
            } else { Text("Loading Simulation...") }
        }
        .background(Color.black)
        .edgesIgnoringSafeArea(.bottom)
        .onAppear(perform: startSimulation)
        .onDisappear(perform: { timer?.cancel() })
        .lockOrientation(to: .landscape)
    }
    
    private func startSimulation() {
        guard let playerTeamInfo = gameManager.getPlayerTeamInfo(),
              let gameToPlay = gameManager.seasonSchedule?.games.first(where: { $0.gameResult?.id == gameLog.id }),
              let opponentInfo = DatabaseManager.shared.getTeamWith(id: gameToPlay.opponent.id)
        else { return }
        
        self.session = SimulationEngine.shared.createGame(playerTeam: playerTeamInfo, opponent: opponentInfo)
        
        self.timer = Timer.publish(every: gameSpeed, on: .main, in: .common)
            .autoconnect()
            .sink { _ in
                guard var currentSession = self.session else { return }
                
                // The timer now runs in real-time, matching the game clock's change.
                currentSession.gameTime -= Int(gameSpeed)
                
                withAnimation(.linear(duration: gameSpeed)) {
                    self.session = SimulationEngine.shared.advance(session: currentSession)
                }
                
                if currentSession.period > 3 { timer?.cancel() }
            }
    }
    
    private func formatTime(seconds: Int) -> String {
        let min = max(0, seconds / 60); let sec = max(0, seconds % 60)
        return String(format: "%02d:%02d", min, sec)
    }

    private func scale(eventCoords: CGPoint, to screenSize: CGSize) -> CGPoint {
        let rinkAspectRatio: CGFloat = 1000 / 850
        let screenAspectRatio = screenSize.width / screenSize.height
        var rinkSize = screenSize; var origin = CGPoint.zero
        if screenAspectRatio > rinkAspectRatio {
            rinkSize.width = screenSize.height * rinkAspectRatio
            origin.x = (screenSize.width - rinkSize.width) / 2
        } else {
            rinkSize.height = screenSize.width / rinkAspectRatio
            origin.y = (screenSize.height - rinkSize.height) / 2
        }
        let scaleX = rinkSize.width / 1000;  let scaleY = rinkSize.height / 850
        return CGPoint(x: (eventCoords.x * scaleX) + origin.x, y: (eventCoords.y * scaleY) + origin.y)
    }
}

struct PlayerIconView: View {
    let player: LiveGameSession.PlayerState
    let playerTeamId: Int64
    
    var body: some View {
        ZStack {
            let isGoalie = player.role == "G"
            let color = player.teamId == playerTeamId ? Color.blue : Color.red
            
            // FIXED: Icons are now slightly smaller circles
            Circle()
                .fill(color)
                .frame(width: isGoalie ? 30 : 22, height: isGoalie ? 30 : 22)
                .overlay(Circle().stroke(Color.white, lineWidth: 1.5))

            Text(player.role)
                .font(.system(size: 9, weight: .bold))
                .foregroundColor(.white)
        }
    }
}

// ... PuckView and LiveGameView_Previews remain the same
struct PuckView: View {
    var body: some View {
        ZStack {
            Circle().fill(Color.white).frame(width: 15, height: 15)
            Circle().fill(Color.black).frame(width: 12, height: 12)
        }
    }
}

struct LiveGameView_Previews: PreviewProvider {
    static var previews: some View {
        let previewGameManager = GameManager()
        let playerTeam = TeamInfo(id: 1, name: "BLU", rating: 80)
        let opponentTeam = TeamInfo(id: 2, name: "RED", rating: 80)
        
        let game = ScheduledGame(gameDate: Date(), opponent: opponentTeam, wasPlayed: true)
        previewGameManager.seasonSchedule = GameSchedule(games: [game])
        let log = GameEventLog(playerTeamName: playerTeam.name, opponentTeamName: opponentTeam.name, entries: [])
        previewGameManager.activeGameLog = log
        
        previewGameManager.seasonSchedule?.games[0].gameResult = log
        
        return LiveGameView(gameLog: log)
            .environmentObject(previewGameManager)
    }
}
