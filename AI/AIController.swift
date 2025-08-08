//
//  AIController.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// The "brain" for a single player agent. Manages the GOAP planning and plan execution.
class AIController {
    unowned let body: Body
    
    private var availableActions: [GOAPAction]
    private var availableGoals: [GOAPGoal]
    private let planner: GOAPPlanner
    
    private var currentPlan: [GOAPAction]?
    
    init(body: Body) {
        self.body = body
        self.planner = GOAPPlanner()
        
        self.availableActions = [
            SkateToPuckAction(),
            PickupPuckAction()
        ]
        self.availableGoals = [PossessPuckGoal()]
    }
    
    func update(in scene: GameScene) {
        let currentState = getCurrentWorldState(in: scene)
        
        // 1. PLAN: If we don't have a plan, create one.
        if currentPlan == nil || currentPlan!.isEmpty {
            if let bestGoal = availableGoals.first { // In the future, we can have logic to pick the best goal
                if let plan = planner.findPlan(availableActions: availableActions, goal: bestGoal, currentState: currentState) {
                    currentPlan = plan
                    // Log the new plan to the console for debugging.
                    let planNames = plan.map { $0.name }
                    if !planNames.isEmpty {
                         print("\(body.userData?.name ?? "Player") created new plan: \(planNames)")
                    }
                }
            }
        }
        
        // 2. ACT: If we have a valid plan, execute the next step.
        if var plan = currentPlan, !plan.isEmpty {
            let currentAction = plan.first!
            
            // Check if the preconditions for the current action are met.
            if !isStateSatisfied(currentAction.preconditions, by: currentState) {
                // The world has changed in a way that makes our plan invalid.
                // Clear the plan so the AI will create a new one on the next frame.
                currentPlan = nil
                return
            }
            
            // Execute the action and check its status.
            let status = currentAction.execute(in: scene, for: body)
            
            switch status {
            case .success:
                // The action is complete, so remove it from the plan.
                plan.removeFirst()
                currentPlan = plan
            case .failure:
                // The action failed, so the entire plan is invalid. Re-plan next frame.
                currentPlan = nil
            case .running:
                // The action is still in progress. Do nothing and continue executing it next frame.
                break
            }
            
        } else {
            // If no plan exists or could be found, be idle.
            body.velocity *= 0.95
        }
    }
    
    /// Gathers facts about the world to create the current state for the planner.
    private func getCurrentWorldState(in scene: GameScene) -> WorldState {
        var state = WorldState()
        
        // The "hasPuck" state is now determined by the official puckCarrier in the scene.
        state["hasPuck"] = scene.puckCarrier?.id == body.id
        
        // The "isNearPuck" state is still based on physical proximity.
        if let puck = scene.puckBody {
            let distanceToPuck = (puck.position - body.position).length()
            state["isNearPuck"] = distanceToPuck < 5.0
        } else {
            state["isNearPuck"] = false
        }
        
        return state
    }
    
    /// Helper to check if a set of preconditions is met by the current state.
    private func isStateSatisfied(_ preconditions: WorldState, by currentState: WorldState) -> Bool {
        for (key, value) in preconditions {
            if currentState[key] != value {
                return false
            }
        }
        return true
    }
}
