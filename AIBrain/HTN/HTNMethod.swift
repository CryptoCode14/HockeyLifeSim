//
//  HTNMethod.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/8/25.
//

import Foundation

/// Represents a single "method" or "recipe" for decomposing a CompoundTask.
struct HTNMethod {
    /// A function that checks if this method's conditions are met in the current game state.
    var conditions: (AIAgent, GameScene) -> Bool
    
    /// The list of sub-tasks to be performed if the conditions are met.
    var subtasks: [HTNTask]
}
