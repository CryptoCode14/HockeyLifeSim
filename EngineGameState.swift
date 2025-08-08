//
//  EngineGameState.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics // Import CoreGraphics to use CGRect

// Represents a single, complete snapshot of the simulation at a moment in time.
struct EngineGameState {
    var homeSkaters: [PlayerBody]
    var awaySkaters: [PlayerBody]
    
    var homeGoalie: PlayerBody
    var awayGoalie: PlayerBody
    
    var puck: PuckBody
    
    // NEW: Define the physical frames of the goals for collision detection.
    // A standard hockey net is 6ft wide and 4ft high.
    let homeGoalFrame = CGRect(x: RinkConstants.leftGoalLine, y: (RinkConstants.height / 2) - 3, width: 1, height: 6)
    let awayGoalFrame = CGRect(x: RinkConstants.rightGoalLine, y: (RinkConstants.height / 2) - 3, width: 1, height: 6)
    
    // --- We can add more state info here later ---
    var gameTime: TimeInterval
    var period: Int
    var homeScore: Int = 0
    var awayScore: Int = 0
}
