//
//  SkateToPuckAction.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

struct SkateToPuckAction: GOAPAction {
    let name = "SkateToPuck" // NEW
    var cost: Float = 1.0
//... rest of file is the same


    var preconditions: WorldState = ["hasPuck": false]
    var effects: WorldState = ["isNearPuck": true]
    
    func execute(in scene: GameScene, for body: Body) -> NodeState {
        guard let puckBody = scene.puckBody else {
            return .failure // Can't find the puck, so this action fails.
        }
        
        // The state of this action is the state of the underlying skate node.
        let skateNode = SkateToTargetNode(target: puckBody.position)
        return skateNode.execute(in: scene, for: body)
    }
}
