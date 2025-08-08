//
//  BehaviorTreeNode.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// The result state of a node after it has been executed.
enum NodeState {
    case success, failure, running
}

/// The base protocol for all nodes in a Behavior Tree.
protocol BehaviorTreeNode {
    /// Executes the logic of the node.
    /// - Parameters:
    //    - scene: The current game scene for context.
    ///   - body: The body of the agent executing the behavior.
    /// - Returns: The state of the node after execution.
    func execute(in scene: GameScene, for body: Body) -> NodeState
}
