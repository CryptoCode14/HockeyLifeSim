//
//  HTNDomain.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation
import CoreGraphics

/// The "Domain" represents the entire library of tasks (the playbook) an AI agent understands.
struct HTNDomain {
    private var tasks: [String: HTNTask] = [:]
    
    init() {
        buildDomain()
    }
    
    func getTask(named name: String) -> HTNTask? {
        return tasks[name]
    }
    
    private mutating func buildDomain() {
        // --- Primitive Tasks ---
        add(task: IdleTask())
        add(task: AcquirePuckTask())
        add(task: SkateToPositionTask())
        add(task: ShootAtNetTask())
        // Note: SetBlackboardValueTask is not added here as it's created dynamically.

        // --- Compound Tasks ---
        add(task: GetPuckTask())
        add(task: ScoreGoalTask())
    }
    
    private mutating func add(task: HTNTask) {
        tasks[task.name] = task
    }
}
