//
//  HTNTask.swift
//
//  HTNTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation

/// The execution status of a task.
enum TaskStatus {
    case success, failure, running
}

/// The base protocol for all tasks in the HTN.
protocol HTNTask {
    var name: String { get }
}

/// A task that can be executed directly by an agent.
protocol PrimitiveTask: HTNTask {
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus
}

/// A task that must be broken down into smaller sub-tasks.
protocol CompoundTask: HTNTask {
    /// Provides one or more ways (methods) to decompose this task.
    func findMethods(for agent: AIAgent, in scene: GameScene) -> [HTNMethod]
}

/// A special type of CompoundTask that holds a pre-defined list of primitive tasks.
/// Useful for assigning simple, direct plans to an agent for testing.
struct PrimitiveTaskSequence: CompoundTask {
    let name = "PrimitiveSequence"
    var tasks: [PrimitiveTask]

    func findMethods(for agent: AIAgent, in scene: GameScene) -> [HTNMethod] {
        return [
            HTNMethod(conditions: { _, _ in true }, subtasks: tasks)
        ]
    }
}
