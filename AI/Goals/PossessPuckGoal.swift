//
//  PossessPuckGoal.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

struct PossessPuckGoal: GOAPGoal {
    // The AI's ultimate desire is to have the puck.
    var desiredState: WorldState = ["hasPuck": true]
    
    // This is a very high priority goal.
    var priority: Float = 90.0
}
