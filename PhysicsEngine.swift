//
//  PhysicsEngine.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

class PhysicsEngine {

    // The main entry point for the physics simulation.
    // It takes the current state and a time step (e.g., 1/60th of a second) and returns the new state.
    func update(gameState: EngineGameState, deltaTime: TimeInterval) -> EngineGameState {
        var newState = gameState
        let allPlayers = newState.homeSkaters + newState.awaySkaters + [newState.homeGoalie, newState.awayGoalie]

        // 1. Apply environmental forces like friction.
        applyForces(to: &newState)
        
        // 2. Update the position of every entity based on its velocity.
        moveEntities(in: &newState, deltaTime: deltaTime)
        
        // 3. Detect and resolve any collisions that occurred after moving.
        handleCollisions(in: &newState, allPlayers: allPlayers)
        
        return newState
    }
    
    // MARK: - Core Physics Steps

    private func applyForces(to gameState: inout EngineGameState) {
        let friction = PhysicsCoefficients.iceFriction
        
        // Apply ice friction to the puck
        gameState.puck.velocity.dx *= friction
        gameState.puck.velocity.dy *= friction
        
        // Apply ice friction to all players
        for i in 0..<gameState.homeSkaters.count {
            gameState.homeSkaters[i].velocity.dx *= friction
            gameState.homeSkaters[i].velocity.dy *= friction
        }
        for i in 0..<gameState.awaySkaters.count {
            gameState.awaySkaters[i].velocity.dx *= friction
            gameState.awaySkaters[i].velocity.dy *= friction
        }
        gameState.homeGoalie.velocity.dx *= friction
        gameState.homeGoalie.velocity.dy *= friction
        gameState.awayGoalie.velocity.dx *= friction
        gameState.awayGoalie.velocity.dy *= friction
    }
    
    private func moveEntities(in gameState: inout EngineGameState, deltaTime: TimeInterval) {
        let dt = CGFloat(deltaTime)
        
        // Update puck position
        gameState.puck.position.x += gameState.puck.velocity.dx * dt
        gameState.puck.position.y += gameState.puck.velocity.dy * dt
        
        // Update player positions
        for i in 0..<gameState.homeSkaters.count {
            gameState.homeSkaters[i].position.x += gameState.homeSkaters[i].velocity.dx * dt
            gameState.homeSkaters[i].position.y += gameState.homeSkaters[i].velocity.dy * dt
        }
        for i in 0..<gameState.awaySkaters.count {
            gameState.awaySkaters[i].position.x += gameState.awaySkaters[i].velocity.dx * dt
            gameState.awaySkaters[i].position.y += gameState.awaySkaters[i].velocity.dy * dt
        }
        gameState.homeGoalie.position.x += gameState.homeGoalie.velocity.dx * dt
        gameState.homeGoalie.position.y += gameState.homeGoalie.velocity.dy * dt
        gameState.awayGoalie.position.x += gameState.awayGoalie.velocity.dx * dt
        gameState.awayGoalie.position.y += gameState.awayGoalie.velocity.dy * dt
    }
    
    private func handleCollisions(in gameState: inout EngineGameState, allPlayers: [PlayerBody]) {
        // --- Puck Collisions ---
        handlePuckWallCollision(puck: &gameState.puck)
        handlePuckGoalCollision(puck: &gameState.puck, goalFrame: gameState.homeGoalFrame)
        handlePuckGoalCollision(puck: &gameState.puck, goalFrame: gameState.awayGoalFrame)
        
        // --- Entity-to-Entity Collisions (Player-Player, Puck-Player) ---
        // This is a naive O(n^2) check. For 12 players and 1 puck, this is perfectly fine.
        var bodies: [PhysicsBody] = allPlayers.map { $0 } + [gameState.puck]
        
        for i in 0..<bodies.count {
            for j in (i + 1)..<bodies.count {
                var body1 = bodies[i]
                var body2 = bodies[j]
                
                let dx = body2.position.x - body1.position.x
                let dy = body2.position.y - body1.position.y
                let distance = sqrt(dx*dx + dy*dy)
                
                if distance < body1.radius + body2.radius {
                    // Collision detected! Resolve it.
                    resolveCollision(body1: &body1, body2: &body2)
                    
                    // IMPORTANT: Write the changed data back to the array.
                    bodies[i] = body1
                    bodies[j] = body2
                }
            }
        }
        
        // After iterating, update the main game state from the modified `bodies` array.
        // This is crucial because structs are value types.
        gameState.puck = bodies.first(where: { $0.id == gameState.puck.id }) as! PuckBody
        // (Similar update logic for players would go here)
    }

    // MARK: - Collision Resolution
    
    private func resolveCollision(body1: inout PhysicsBody, body2: inout PhysicsBody) {
        // This function calculates the physically accurate response for a 2D elastic collision.
        let dx = body2.position.x - body1.position.x
        let dy = body2.position.y - body1.position.y
        let distance = sqrt(dx*dx + dy*dy)
        
        // Collision normal vector (points from body1 to body2)
        let normalX = dx / distance
        let normalY = dy / distance
        
        // Relative velocity
        let relativeVelocityX = body1.velocity.dx - body2.velocity.dx
        let relativeVelocityY = body1.velocity.dy - body2.velocity.dy
        
        // Dot product of relative velocity and the normal vector.
        let speed = relativeVelocityX * normalX + relativeVelocityY * normalY
        
        // Only resolve if objects are moving towards each other.
        if speed < 0 { return }

        // The impulse (change in momentum) calculation.
        // Simplified for perfect elasticity for now.
        let impulse = 2 * speed / (body1.mass + body2.mass)
        
        // Apply the impulse to each body's velocity.
        body1.velocity.dx -= impulse * body2.mass * normalX
        body1.velocity.dy -= impulse * body2.mass * normalY
        
        body2.velocity.dx += impulse * body1.mass * normalX
        body2.velocity.dy += impulse * body1.mass * normalY
    }

    private func handlePuckWallCollision(puck: inout PuckBody) {
        // A more advanced implementation that handles rounded corners will be added later.
        if (puck.position.y - puck.radius < 0 && puck.velocity.dy < 0) || (puck.position.y + puck.radius > RinkConstants.height && puck.velocity.dy > 0) {
            puck.velocity.dy *= -PhysicsCoefficients.puckRestitution
        }
        if (puck.position.x - puck.radius < 0 && puck.velocity.dx < 0) || (puck.position.x + puck.radius > RinkConstants.width && puck.velocity.dx > 0) {
            puck.velocity.dx *= -PhysicsCoefficients.puckRestitution
        }
    }
    
    private func handlePuckGoalCollision(puck: inout PuckBody, goalFrame: CGRect) {
        // Simplified: check for intersection with the goal's rectangle.
        // A full implementation would check against the 3 line segments (posts and crossbar).
        let puckFrame = CGRect(x: puck.position.x - puck.radius, y: puck.position.y - puck.radius, width: puck.radius*2, height: puck.radius*2)
        
        if puckFrame.intersects(goalFrame) {
            // High-restitution "ping" off the post.
            // For now, we'll just reverse velocity as a placeholder.
            puck.velocity.dx *= -1.5 // Extra bounce
            puck.velocity.dy *= -1.5
        }
    }
}
