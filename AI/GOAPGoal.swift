//
//  GOAPGoal.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// Represents a high-level goal that an AI agent wants to achieve.
/// A goal is defined by a set of conditions that the agent wants to be true in the world state.
protocol GOAPGoal {
    /// A dictionary representing the desired state of the world.
    /// Example: ["hasScoredGoal": true]
    var desiredState: WorldState { get }
    
    /// The priority of this goal, used to decide which goal to pursue if multiple are available.
    var priority: Float { get }
}
