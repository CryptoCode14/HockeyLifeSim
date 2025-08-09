//
//  ScoreGoalTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation
import CoreGraphics

struct ScoreGoalTask: CompoundTask {
    let name = "ScoreGoal"
    
    func findMethods(for agent: AIAgent, in scene: GameScene) -> [HTNMethod] {
        var methods: [HTNMethod] = []
        
        let getAndShootMethod = HTNMethod(
            conditions: { agent, scene in
                return true
            },
            subtasks: {
                let rinkWidth: CGFloat = 200.0
                let rinkHeight: CGFloat = 85.0
                let isHomeTeam = agent.body.userData?.name.contains("home") ?? false
                let targetNetPosition = isHomeTeam ? CGPoint(x: rinkWidth - 15, y: rinkHeight / 2) : CGPoint(x: 15, y: rinkHeight / 2)
                
                return [
                    domain.getTask(named: "GetPuck")!,
                    SetBlackboardValueTask(key: "targetPosition", value: targetNetPosition),
                    domain.getTask(named: "ShootAtNet")!
                ]
            }()
        )
        methods.append(getAndShootMethod)
        
        return methods
    }
}
