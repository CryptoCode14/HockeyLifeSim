//
//  ShootAtNetTask.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/9/25.
//

import Foundation
import CoreGraphics

struct ShootAtNetTask: PrimitiveTask {
    let name = "ShootAtNet"
    
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus {
        guard let puck = scene.puckBody, scene.puckCarrier?.id == agent.body.id else { return .failure }
        guard let targetPosition = agent.blackboard["targetPosition"] as? CGPoint else { return .failure }

        print("\(agent.body.userData?.name ?? "Player") is shooting!")
        
        scene.puckCarrier = nil
        let shotDirection = (targetPosition - puck.position).normalized()
        puck.velocity = shotDirection * 120.0
        
        return .success
    }
}
