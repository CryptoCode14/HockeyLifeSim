//
//  HTNPlanner.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/8/25.
//

import Foundation

class HTNPlanner {
    /// Decomposes a task into a sequence of primitive tasks.
    func findPlan(for task: HTNTask, on agent: AIAgent, in scene: GameScene) -> [PrimitiveTask]? {
        var plan: [PrimitiveTask] = []
        if decompose(task: task, on: agent, in: scene, currentPlan: &plan) {
            return plan
        }
        return nil
    }

    private func decompose(task: HTNTask, on agent: AIAgent, in scene: GameScene, currentPlan: inout [PrimitiveTask]) -> Bool {
        if let primitiveTask = task as? PrimitiveTask {
            currentPlan.append(primitiveTask)
            return true
        }

        if let compoundTask = task as? CompoundTask {
            let methods = compoundTask.findMethods(for: agent, in: scene)
            for method in methods {
                if method.conditions(agent, scene) {
                    var subPlan: [PrimitiveTask] = []
                    var success = true
                    for subtask in method.subtasks {
                        if !decompose(task: subtask, on: agent, in: scene, currentPlan: &subPlan) {
                            success = false
                            break
                        }
                    }
                    if success {
                        currentPlan.append(contentsOf: subPlan)
                        return true
                    }
                }
            }
        }
        return false
    }
}
