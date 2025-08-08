//
//  AIAction.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation

/// A protocol that defines any possible action a player can take in the game.
protocol AIAction {
    /// The name of the action, used for debugging.
    var name: String { get }
    
    /// Calculates how desirable this action is in the current game state.
    /// - Parameters:
    ///   - scene: The current game scene, providing context about all objects.
    ///   - body: The physics body of the player considering the action.
    /// - Returns: A score from 0.0 (don't do this) to 1.0+ (highly desirable).
    func calculateUtility(in scene: GameScene, for body: Body) -> Double
    
    /// Executes the action.
    /// - Parameters:
    ///   - scene: The current game scene.
    ///   - body: The physics body of the player performing the action.
    func execute(in scene: GameScene, for body: Body)
}
