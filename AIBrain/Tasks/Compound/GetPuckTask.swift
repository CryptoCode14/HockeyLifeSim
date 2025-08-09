//
//  GetPuckTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation

struct GetPuckTask: CompoundTask {
    let name = "GetPuck"
    
    func findMethods(for agent: AIAgent, in scene: GameScene) -> [HTNMethod] {
        var methods: [HTNMethod] = []
        
        let chasePuckMethod = HTNMethod(
            conditions: { agent, scene in
                return scene.puckCarrier == nil && scene.puckBody != nil
            },
            subtasks: [
                SetBlackboardValueTask(key: "targetPosition", value: scene.puckBody!.position),
                domain.getTask(named: "SkateToPosition")!,
                domain.getTask(named: "AcquirePuck")!
            ]
        )
        methods.append(chasePuckMethod)
        
        return methods
    }
}
