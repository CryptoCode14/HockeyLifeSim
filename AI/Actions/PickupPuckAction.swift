//
//  PickupPuckAction.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

struct PickupPuckAction: GOAPAction {
    let name = "PickupPuck" // NEW
    var cost: Float = 1.0
//... rest of file is the same


    var preconditions: WorldState = ["isNearPuck": true, "hasPuck": false]
    var effects: WorldState = ["hasPuck": true]
    
    func execute(in scene: GameScene, for body: Body) -> NodeState {
        // This action can only succeed if no one else has the puck.
        guard scene.puckCarrier == nil else { return .failure }
        
        if let role = body.userData?.name {
            print("\(role) picked up the puck.")
        }
        
        // FIXED: Set this body as the official puck carrier in the scene.
        scene.puckCarrier = body
        
        return .success
    }
}
