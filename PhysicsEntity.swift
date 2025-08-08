//
//  PhysicsEntity.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/7/25.
//

import Foundation
import CoreGraphics

// A protocol that defines the necessary physical properties for any object in our simulation.
protocol PhysicsBody {
    var id: UUID { get }
    var position: CGPoint { get set }
    var velocity: CGVector { get set }
    var mass: CGFloat { get }
    var radius: CGFloat { get } // We'll use circles for collision detection.
}

// A concrete implementation of a player's physical body.
struct PlayerBody: PhysicsBody {
    let id = UUID()
    var position: CGPoint
    var velocity: CGVector = .zero

    // Mass will be derived from player strength. We'll use a placeholder for now.
    let mass: CGFloat = 80.0 // Kilograms
    let radius: CGFloat = 2.0 // Feet
}

// A concrete implementation of the puck's physical body.
struct PuckBody: PhysicsBody {
    let id = UUID()
    var position: CGPoint
    var velocity: CGVector = .zero

    let mass: CGFloat = 0.17 // Kilograms
    let radius: CGFloat = 0.125 // Feet (3-inch diameter)
}
