//
//  SkateToPuckAction.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// A concrete GOAPAction for a player to skate towards the puck.
struct SkateToPuckAction: GOAPAction {
    var cost: Float = 1.0 // A baseline cost for movement.
    
    // This action has no preconditions; a player can always decide to skate to the puck.
    var preconditions: WorldState = [:]
    
    // The effect of this action is that the player will be near the puck.
    // The planner will use this to satisfy goals like "GetThePuck".
    var effects: WorldState = ["isNearPuck": true]
    
    func execute(in scene: GameScene, for body: Body) {
        // This is where the GOAP action interfaces with the Behavior Tree.
        // It tells the player's "body" to execute the low-level skating behavior.
        
        // Find the puck's body in the world.
        guard let puckBody = scene.world.bodies.first(where: { $0.userData?.name == "puck" }) else {
            return
        }
        
        // Use a Behavior Tree Node to handle the actual movement.
        let skateNode = SkateToTargetNode(target: puckBody.position)
        _ = skateNode.execute(in: scene, for: body)
    }
    
    // In a full implementation, the utility would be more complex.
    // For now, it's always desirable to go to the puck.
    func calculateUtility(in scene: GameScene, for body: Body) -> Double {
        return 0.8
    }
}
