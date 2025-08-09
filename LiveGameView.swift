//
//  LiveGameView.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import SwiftUI

struct LiveGameView: View {
    @EnvironmentObject var gameManager: GameManager
    
    var body: some View {
        GeometryReader { geo in
            if let scene = gameManager.activeGameScene {
                ZStack(alignment: .top) {
                    
                    ZStack {
                        Image("hockey_rink")
                            .resizable()
                            .aspectRatio(contentMode: .fit)

                        Color.clear.overlay(
                            GeometryReader { rinkGeo in
                                let rinkFrame = rinkGeo.frame(in: .local)
                                
                                ForEach(scene.world.bodies, id: \.id) { body in
                                    if let userData = body.userData {
                                        let (position, scale) = scale(point: body.position, rinkFrame: rinkFrame)
                                        
                                        switch userData.name {
                                        case let name where name.contains("home_player"):
                                            PlayerIconView(physicsBody: body, color: .blue, scale: scale)
                                                .position(position)
                                        case let name where name.contains("away_player"):
                                            PlayerIconView(physicsBody: body, color: .red, scale: scale)
                                                .position(position)
                                        case "puck":
                                            PuckView(physicsBody: body, scale: scale)
                                                .position(position)
                                        default:
                                            EmptyView()
                                        }
                                    }
                                }
                            }
                        )
                    }
                    .frame(width: geo.size.width, height: geo.size.height)
                    
                    ScoreboardView(
                        playerTeamName: String(scene.homeTeam.name.prefix(3)),
                        opponentTeamName: String(scene.awayTeam.name.prefix(3)),
                        playerScore: scene.homeScore,
                        opponentScore: scene.awayScore,
                        period: "\(scene.period)\(ordinalSuffix(for: scene.period))",
                        clock: formatTime(seconds: scene.gameTime),
                        playerSOG: scene.homeSOG,
                        opponentSOG: scene.awaySOG,
                        powerPlayTime: nil,
                        isPlayerTeamOnPP: false
                    )
                    .padding(.top, geo.safeAreaInsets.top)
                }
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
    
    private func scale(point: CGPoint, rinkFrame: CGRect) -> (position: CGPoint, scale: CGFloat) {
        let scaleFactor = rinkFrame.width / 200.0
        let viewPosition = CGPoint(
            x: point.x * scaleFactor,
            y: point.y * scaleFactor
        )
        return (viewPosition, scaleFactor)
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
        case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"
        }
    }
} // NOTE: The extra brace that caused the error was here. It has been removed.

// MARK: - Helper Views
struct PlayerIconView: View {
    let physicsBody: Body
    var color: Color = .blue
    let scale: CGFloat
    
    var body: some View {
        let radius = (physicsBody.fixtures.first?.shape as? CircleShape)?.radius ?? 2.0
        let frameSize = radius * 2 * scale
        
        ZStack {
            Circle()
                .fill(color)
                .overlay(Circle().stroke(Color.white, lineWidth: 2))
            if let name = physicsBody.userData?.name, let role = name.split(separator: "_").last {
                Text(String(role))
                    .font(.system(size: frameSize * 0.4, weight: .bold))
                    .foregroundColor(.white)
            }
        }
        .frame(width: frameSize, height: frameSize)
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
