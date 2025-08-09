//
//  SetBlackboardValueTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation

/// A utility task that sets a value on an agent's blackboard.
struct SetBlackboardValueTask: PrimitiveTask {
    let name = "SetBlackboardValue"
    let key: String
    let value: Any
    
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus {
        agent.blackboard[key] = value
        return .success
    }
}

// Global accessor for the domain to be used by compound tasks
let domain = HTNDomain()
