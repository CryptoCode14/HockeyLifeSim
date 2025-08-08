//
//  SkateToTargetNode.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

/// A concrete Behavior Tree Node that applies force to a body to move it towards a target.
struct SkateToTargetNode: BehaviorTreeNode {
    let target: CGPoint
    
    private let maxSpeed: CGFloat = 30.0
    private let steeringForce: CGFloat = 150.0
    
    func execute(in scene: GameScene, for body: Body) -> NodeState {
        // Check if we have arrived at the target.
        let distanceToTarget = (target - body.position).length()
        if distanceToTarget < 1.0 { // Close enough (1 foot)
            body.velocity = .zero // Stop moving
            return .success
        }
        
        let desiredVelocity = (target - body.position).normalized() * maxSpeed
        var steering = desiredVelocity - body.velocity
        
        if steering.length() > steeringForce {
            steering = steering.normalized() * steeringForce
        }
        
        body.velocity += steering * (1.0 / 60.0)
        
        if body.velocity.lengthSquared() > maxSpeed * maxSpeed {
            body.velocity = body.velocity.normalized() * maxSpeed
        }
        
        // We are still on our way to the target.
        return .running
    }
}
