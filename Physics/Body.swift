//
//  Body.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

/// Defines the type of a physical body.
enum BodyType {
    case `static`, dynamic
}

/// A simple struct to hold user-defined data for a body.
struct BodyUserData {
    var name: String // e.g., "puck", "home_player_1", "rink_wall"
}

/// The core object in the physics simulation.
class Body {
    let id = UUID()
    let type: BodyType
    
    var position: CGPoint
    var velocity: CGVector = .zero
    
    // NEW: Add a user data property to store game-specific info.
    var userData: BodyUserData?
    
    var mass: CGFloat {
        return type == .static ? CGFloat.greatestFiniteMagnitude : 1.0
    }
    var inverseMass: CGFloat {
        return type == .static ? 0.0 : 1.0 / mass
    }
    
    var fixtures: [Fixture] = []
    
    init(type: BodyType, position: CGPoint) {
        self.type = type
        self.position = position
    }
    
    func add(fixture: Fixture) {
        self.fixtures.append(fixture)
    }
}
