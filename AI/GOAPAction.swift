//
//  GOAPAction.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

typealias WorldState = [String: Bool]

protocol GOAPAction {
    // NEW: Add a name for easier debugging.
    var name: String { get }
    var cost: Float { get }
    var preconditions: WorldState { get }
    var effects: WorldState { get }
    
    func execute(in scene: GameScene, for body: Body) -> NodeState
}
