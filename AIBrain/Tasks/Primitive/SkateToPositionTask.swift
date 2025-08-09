//
//  SkateToPositionTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation
import CoreGraphics

struct SkateToPositionTask: PrimitiveTask {
    let name = "SkateToPosition"
    
    private let maxSpeed: CGFloat = 35.0
    private let steeringForce: CGFloat = 150.0
    
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus {
        guard let targetPosition = agent.blackboard["targetPosition"] as? CGPoint else {
            return .failure
        }
        
        let body = agent.body
        if (targetPosition - body.position).length() < 1.5 {
            body.velocity = .zero
            return .success
        }
        
        let desiredVelocity = (targetPosition - body.position).normalized() * maxSpeed
        var steering = desiredVelocity - body.velocity
        
        if steering.length() > steeringForce {
            steering = steering.normalized() * steeringForce
        }
        
        body.velocity += steering * (1.0 / 60.0)
        
        if body.velocity.lengthSquared() > maxSpeed * maxSpeed {
            body.velocity = body.velocity.normalized() * maxSpeed
        }
        
        return .running
    }
}
