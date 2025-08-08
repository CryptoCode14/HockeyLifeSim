//
//  GOAPPlanner.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// The brain of the GOAP system. It uses an A* search algorithm to find an optimal sequence of actions to satisfy a goal.
class GOAPPlanner {

    private class PlanNode: Comparable {
        var parent: PlanNode?
        var action: GOAPAction?
        var state: WorldState
        var gCost: Float
        var hCost: Float
        var fCost: Float { gCost + hCost }

        init(parent: PlanNode?, action: GOAPAction?, state: WorldState, gCost: Float, hCost: Float) {
            self.parent = parent
            self.action = action
            self.state = state
            self.gCost = gCost
            self.hCost = hCost
        }

        static func < (lhs: PlanNode, rhs: PlanNode) -> Bool {
            return lhs.fCost < rhs.fCost
        }
        static func == (lhs: PlanNode, rhs: PlanNode) -> Bool {
            return lhs.state == rhs.state
        }
    }

    func findPlan(availableActions: [GOAPAction], goal: GOAPGoal, currentState: WorldState) -> [GOAPAction]? {
        var openList: [PlanNode] = []
        var closedList: Set<WorldState> = []

        let hCost = calculateHeuristic(from: goal.desiredState, to: currentState)
        let startNode = PlanNode(parent: nil, action: nil, state: goal.desiredState, gCost: 0, hCost: hCost)
        openList.append(startNode)

        while !openList.isEmpty {
            openList.sort()
            let currentNode = openList.removeFirst()
            
            if closedList.contains(currentNode.state) {
                continue
            }
            closedList.insert(currentNode.state)
            
            if isStateSatisfied(currentNode.state, by: currentState) {
                return reconstructPlan(from: currentNode)
            }
            
            for action in availableActions {
                if isStateSatisfied(currentNode.state, by: action.effects) {
                    
                    var precedingState = currentNode.state
                    action.effects.keys.forEach { precedingState.removeValue(forKey: $0) }
                    action.preconditions.forEach { precedingState[$0.key] = $0.value }

                    if closedList.contains(precedingState) {
                        continue
                    }
                    
                    let gCost = currentNode.gCost + action.cost
                    let hCost = calculateHeuristic(from: precedingState, to: currentState)
                    let neighborNode = PlanNode(parent: currentNode, action: action, state: precedingState, gCost: gCost, hCost: hCost)
                    
                    openList.append(neighborNode)
                }
            }
        }
        
        return nil // No plan found
    }
    
    private func isStateSatisfied(_ targetState: WorldState, by sourceState: WorldState) -> Bool {
        for (key, value) in targetState {
            if sourceState[key] != value {
                return false
            }
        }
        return true
    }
    
    private func calculateHeuristic(from state: WorldState, to goalState: WorldState) -> Float {
        var distance: Float = 0
        for (key, value) in goalState {
            if state[key] != value {
                distance += 1
            }
        }
        return distance
    }
    
    // FIXED: This now correctly reconstructs the plan in the proper forward order.
    private func reconstructPlan(from endNode: PlanNode) -> [GOAPAction] {
        var plan: [GOAPAction] = []
        var currentNode: PlanNode? = endNode
        
        while let node = currentNode, let action = node.action {
            plan.insert(action, at: 0) // Inserting at the beginning reverses the backward path into a forward plan.
            currentNode = node.parent
        }
        return plan
    }
}

// Make WorldState Hashable to be used in a Set.
extension WorldState: Hashable {
    public func hash(into hasher: inout Hasher) {
        for (key, value) in self.sorted(by: { $0.key < $1.key }) {
            hasher.combine(key)
            hasher.combine(value)
        }
    }
}
