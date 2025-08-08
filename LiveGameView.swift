//
//  LiveGameView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import SwiftUI

struct LiveGameView: View {
    @EnvironmentObject var gameManager: GameManager
    
    var body: some View {
        GeometryReader { geo in
            if let scene = gameManager.activeGameScene {
                ZStack(alignment: .top) { // Align content to the top
                    // Rink and Players
                    ZStack {
                        Image("hockey_rink")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: geo.size.width)

                        ForEach(scene.world.bodies, id: \.id) { body in
                            if let userData = body.userData {
                                let (scaledPosition, scaleFactor) = scale(point: body.position, to: geo.size)
                                
                                switch userData.name {
                                case let name where name.contains("home_player"):
                                    PlayerIconView(physicsBody: body, scale: scaleFactor)
                                        .position(scaledPosition)
                                case let name where name.contains("away_player"):
                                    PlayerIconView(physicsBody: body, color: .red, scale: scaleFactor)
                                        .position(scaledPosition)
                                case "puck":
                                    PuckView(physicsBody: body, scale: scaleFactor)
                                        .position(scaledPosition)
                                default:
                                    EmptyView()
                                }
                            }
                        }
                    }
                    .frame(width: geo.size.width, height: geo.size.height)

                    // --- NEW: Add the Scoreboard on top ---
                    ScoreboardView(
                        playerTeamName: String(scene.homeTeam.name.prefix(3)),
                        opponentTeamName: String(scene.awayTeam.name.prefix(3)),
                        playerScore: scene.homeScore,
                        opponentScore: scene.awayScore,
                        period: "\(scene.period)\(ordinalSuffix(for: scene.period))",
                        clock: formatTime(seconds: scene.gameTime),
                        playerSOG: scene.homeSOG,
                        opponentSOG: scene.awaySOG,
                        powerPlayTime: nil, // Placeholder for now
                        isPlayerTeamOnPP: false // Placeholder for now
                    )
                    .padding(.top, geo.safeAreaInsets.top) // Push down from the status bar
                    
                }
                .frame(width: geo.size.width, height: geo.size.height)
                
            } else {
                Text("Loading Scene...")
            }
        }
        .edgesIgnoringSafeArea(.all)
        .background(Color.black)
        .onDisappear {
            gameManager.endGame()
        }
    }
    
    private func formatTime(seconds: TimeInterval) -> String {
        let time = Int(max(0, seconds))
        let min = time / 60
        let sec = time % 60
        return String(format: "%02d:%02d", min, sec)
    }
    
    private func ordinalSuffix(for number: Int) -> String {
        let ones = number % 10
        let tens = (number / 10) % 10
        if tens == 1 { return "th" }
        switch ones {
        case 1: return "st"
        case 2: return "nd"
        case 3: return "rd"
        default: return "th"
        }
    }
    
    private func scale(point: CGPoint, to containerSize: CGSize) -> (position: CGPoint, scale: CGFloat) {
        let rinkAspectRatio = 200.0 / 85.0
        let containerAspectRatio = containerSize.width / containerSize.height
        
        var rinkSize: CGSize = .zero
        var rinkOrigin: CGPoint = .zero
        
        if containerAspectRatio > rinkAspectRatio {
            rinkSize.height = containerSize.height
            rinkSize.width = containerSize.height * rinkAspectRatio
            rinkOrigin.x = (containerSize.width - rinkSize.width) / 2
            rinkOrigin.y = 0
        } else {
            rinkSize.width = containerSize.width
            rinkSize.height = containerSize.width / rinkAspectRatio
            rinkOrigin.x = 0
            rinkOrigin.y = (containerSize.height - rinkSize.height) / 2
        }
        
        let scaleFactor = rinkSize.width / 200.0
        
        let viewPosition = CGPoint(
            x: (point.x * scaleFactor) + rinkOrigin.x,
            y: (point.y * scaleFactor) + rinkOrigin.y
        )
        
        return (viewPosition, scaleFactor)
    }
}

// MARK: - Helper Views

struct PlayerIconView: View {
    let physicsBody: Body
    var color: Color = .blue
    let scale: CGFloat
    
    var body: some View {
        let radius = (physicsBody.fixtures.first?.shape as? CircleShape)?.radius ?? 2.0
        
        return Circle()
            .fill(color)
            .frame(width: radius * 2 * scale, height: radius * 2 * scale)
            .overlay(Circle().stroke(Color.white, lineWidth: 2))
    }
}

struct PuckView: View {
    let physicsBody: Body
    let scale: CGFloat
    
    var body: some View {
        let radius = (physicsBody.fixtures.first?.shape as? CircleShape)?.radius ?? 0.5
        return Circle()
            .fill(Color.black)
            .frame(width: radius * 2 * scale, height: radius * 2 * scale)
    }
}
