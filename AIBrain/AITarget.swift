//
//  AITarget.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/8/25.
//

import Foundation
import CoreGraphics

/// Represents a dynamic target for an AI task.
enum AITarget {
    case position(CGPoint)
    case thePuck
    case opponentNet
    
    /// Resolves the target to a concrete position in the game world.
    func position(in scene: GameScene, for agent: AIAgent) -> CGPoint? {
        switch self {
        case .position(let point):
            return point
        case .thePuck:
            return scene.puckBody?.position
        case .opponentNet:
            let rinkWidth: CGFloat = 200.0
            let rinkHeight: CGFloat = 85.0
            // Home team (blue) shoots on the right net. Away team (red) shoots on the left.
            let isHomeTeam = agent.body.userData?.name.contains("home") ?? false
            return isHomeTeam ? CGPoint(x: rinkWidth - 15, y: rinkHeight / 2) : CGPoint(x: 15, y: rinkHeight / 2)
        }
    }
}
