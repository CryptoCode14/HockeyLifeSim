//
//  LiveGameSession.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/6/25.
//

import Foundation
import CoreGraphics

struct LiveGameSession {
    var skaters: [PlayerState]
    var goalies: [PlayerState]
    var puck: PuckState
    
    var playerScore: Int = 0, opponentScore: Int = 0
    var playerSOG: Int = 0, opponentSOG: Int = 0
    var gameTime: Int = 1200, period: Int = 1
    
    var situation: GameSituation = .faceoff
    var description: String = "Game is about to start."

    struct PlayerState: Identifiable {
        let id = UUID()
        let teamId: Int64
        let role: String
        let archetype: PlayerArchetype
        var position: CGPoint
    }

    struct PuckState {
        var position: CGPoint
        var velocity: CGVector = .zero
        var owner: PlayerState?
    }
    
    enum GameSituation {
        case faceoff, inPlay
    }
}
