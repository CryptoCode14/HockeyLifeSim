//
//  PhysicsConstants.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/7/25.
//


import Foundation
import CoreGraphics

// Defines the static physical properties and dimensions of our simulation world.
struct RinkConstants {
    // A standard NHL rink is 200ft x 85ft. We'll use these dimensions for our coordinate system.
    // The origin (0,0) will be the top-left corner.
    static let width: CGFloat = 200.0
    static let height: CGFloat = 85.0
    static let bounds = CGRect(x: 0, y: 0, width: width, height: height)

    // The corners of an NHL rink have a 28ft radius.
    static let cornerRadius: CGFloat = 28.0

    // Goal line positions (typically 11ft from the end boards).
    static let leftGoalLine: CGFloat = 11.0
    static let rightGoalLine: CGFloat = width - 11.0

    // The center of the goal mouth.
    static let goalCenterY: CGFloat = height / 2.0
}

// Defines coefficients used in physics calculations.
struct PhysicsCoefficients {
    // Represents the friction of the ice, applied to velocity each tick to slow objects down.
    // A value of 1.0 would be no friction.
    static let iceFriction: CGFloat = 0.99

    // Defines the "bounciness" of the puck when it hits a surface.
    // A value of 1.0 would be a perfect bounce with no energy loss.
    static let puckRestitution: CGFloat = 0.65
    
    // Defines how players react to collisions. A lower value means less bounce.
    static let playerRestitution: CGFloat = 0.5
}
