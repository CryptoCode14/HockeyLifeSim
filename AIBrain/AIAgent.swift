//
//  AIAgent.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation

/// Represents a single AI-controlled player in the game.
class AIAgent {
    unowned let body: Body
    let planner: HTNPlanner
    let domain: HTNDomain
    
    private var currentPlan: [PrimitiveTask]?
    
    // The agent's high-level task, assigned by the "coach" (for now, GameScene)
    var highLevelTask: HTNTask?
    
    init(body: Body, domain: HTNDomain) {
        self.body = body
        self.domain = domain
        self.planner = HTNPlanner()
    }
    
    func update(in scene: GameScene) {
        // If the agent has no task, do nothing.
        guard let task = highLevelTask else {
            body.velocity *= 0.95
            return
        }
        
        // If our plan is empty or complete, create a new one based on our assigned task.
        if currentPlan == nil || currentPlan!.isEmpty {
            if let plan = planner.findPlan(for: task, on: self, in: scene) {
                self.currentPlan = plan
                
                let planNames = plan.map { $0.name }
                if !planNames.isEmpty {
                    print("\(body.userData?.name ?? "Player") CREATED new plan: \(planNames)")
                }
            }
        }
        
        guard var plan = currentPlan, !plan.isEmpty else {
            // If no plan could be found for our task, just be idle.
            body.velocity *= 0.95
            return
        }
        
        let currentTask = plan.first!
        let status = currentTask.execute(on: self, in: scene)
        
        // Log the status of the current task for debugging
        print("\(body.userData?.name ?? "Player") executing '\(currentTask.name)': \(status)")
        
        switch status {
        case .success:
            // This step of the plan is complete. Remove it.
            plan.removeFirst()
            currentPlan = plan
        case .failure:
            // The plan failed. Clear it so we create a new one next frame.
            currentPlan = nil
        case .running:
            // The task is still in progress, continue it on the next frame.
            break
        }
    }
}
