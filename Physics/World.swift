//
//  World.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

/// The main container and simulation engine for the physics world.
class World {
    private(set) var bodies: [Body] = []
    let gravity: CGVector

    init(gravity: CGVector = .zero) {
        self.gravity = gravity
    }

    // MARK: - Public API

    func createBody(type: BodyType, position: CGPoint) -> Body {
        let body = Body(type: type, position: position)
        self.bodies.append(body)
        return body
    }

    func step(in scene: GameScene, deltaTime: TimeInterval, velocityIterations: Int = 8, positionIterations: Int = 3) {
        if scene.gameTime > 0 {
            scene.gameTime -= deltaTime
        } else if scene.period < 3 {
            scene.gameTime = 1200
            scene.period += 1
        }

        let contacts = findContacts()

        integrateForces(deltaTime: deltaTime)

        for _ in 0..<velocityIterations {
            for contact in contacts {
                contact.solveVelocityConstraints()
            }
        }

        integrateVelocities(deltaTime: deltaTime)
        
        for _ in 0..<positionIterations {
            if solvePositionConstraints(contacts: contacts) == false {
                break
            }
        }
    }

    // MARK: - Collision Detection

    private func findContacts() -> [Contact] {
        var contacts: [Contact] = []
        for i in 0..<bodies.count {
            for j in (i + 1)..<bodies.count {
                let bodyA = bodies[i]
                let bodyB = bodies[j]
                if bodyA.type == .static && bodyB.type == .static { continue }

                for fixtureA in bodyA.fixtures {
                    for fixtureB in bodyB.fixtures {
                        if let circleA = fixtureA.shape as? CircleShape, let circleB = fixtureB.shape as? CircleShape {
                            let (collided, normal, depth) = checkCircleCircleCollision(fixtureA: fixtureA, shapeA: circleA, fixtureB: fixtureB, shapeB: circleB)
                            if collided {
                                let contact = Contact(fixtureA: fixtureA, fixtureB: fixtureB, normal: normal, penetrationDepth: depth)
                                contact.prepare()
                                contacts.append(contact)
                            }
                        }
                    }
                }
            }
        }
        return contacts
    }

    private func checkCircleCircleCollision(fixtureA: Fixture, shapeA: CircleShape, fixtureB: Fixture, shapeB: CircleShape) -> (Bool, CGVector, CGFloat) {
        let posA = fixtureA.body.position
        let posB = fixtureB.body.position
        let combinedRadius = shapeA.radius + shapeB.radius

        let dx = posB.x - posA.x
        let dy = posB.y - posA.y
        let distanceSquared = dx*dx + dy*dy

        if distanceSquared < (combinedRadius * combinedRadius) && distanceSquared > 0.001 {
            let distance = sqrt(distanceSquared)
            let normal = CGVector(dx: dx / distance, dy: dy / distance)
            let penetrationDepth = combinedRadius - distance
            return (true, normal, penetrationDepth)
        }
        return (false, .zero, 0)
    }

    // MARK: - Simulation & Solving

    private func integrateForces(deltaTime: TimeInterval) {
        for body in bodies where body.type == .dynamic {
            body.velocity += gravity * CGFloat(deltaTime)
        }
    }

    private func integrateVelocities(deltaTime: TimeInterval) {
        for body in bodies where body.type == .dynamic {
            body.position += body.velocity * CGFloat(deltaTime)
        }
    }

    private func solvePositionConstraints(contacts: [Contact]) -> Bool {
        var minSeparation: CGFloat = 0.0
        for contact in contacts {
            minSeparation = min(minSeparation, contact.solvePositionConstraints())
        }
        return minSeparation < 0.0
    }
}

// A class to hold information about a collision and perform solver calculations.
class Contact {
    let fixtureA: Fixture
    let fixtureB: Fixture
    let normal: CGVector
    let penetrationDepth: CGFloat
    
    private var restitution: CGFloat = 0.0
    private var friction: CGFloat = 0.0

    init(fixtureA: Fixture, fixtureB: Fixture, normal: CGVector, penetrationDepth: CGFloat) {
        self.fixtureA = fixtureA
        self.fixtureB = fixtureB
        self.normal = normal
        self.penetrationDepth = penetrationDepth
    }
    
    func prepare() {
        self.restitution = max(fixtureA.restitution, fixtureB.restitution)
        self.friction = sqrt(fixtureA.friction * fixtureB.friction)
    }
    
    func solveVelocityConstraints() {
        let bodyA = fixtureA.body
        let bodyB = fixtureB.body
        let invMassA = bodyA.inverseMass
        let invMassB = bodyB.inverseMass
        let totalInvMass = invMassA + invMassB
        if totalInvMass == 0 { return }

        let rv = bodyB.velocity - bodyA.velocity
        let rvNormal = rv.dot(normal)

        if rvNormal > 0 { return }

        let e = self.restitution
        var j = -(1.0 + e) * rvNormal
        j /= totalInvMass
        
        let impulseVector = normal * j
        bodyA.velocity -= impulseVector * invMassA
        bodyB.velocity += impulseVector * invMassB
        
        let rvTangent = rv - (normal * rvNormal)
        if rvTangent.lengthSquared() > 0.0001 {
            let tangentDirection = rvTangent.normalized()
            var jt = -rv.dot(tangentDirection)
            jt /= totalInvMass
            
            let maxFriction = self.friction * j
            let frictionImpulseMagnitude = min(abs(jt), maxFriction)
            
            let frictionImpulse = tangentDirection * frictionImpulseMagnitude
            bodyA.velocity -= frictionImpulse * invMassA
            bodyB.velocity += frictionImpulse * invMassB
        }
    }
    
    func solvePositionConstraints() -> CGFloat {
        let bodyA = fixtureA.body
        let bodyB = fixtureB.body
        let invMassA = bodyA.inverseMass
        let invMassB = bodyB.inverseMass
        let totalInvMass = invMassA + invMassB
        if totalInvMass == 0 { return 0.0 }
        
        let k_slop: CGFloat = 0.05
        let percent: CGFloat = 0.4
        
        let correctionAmount = max(penetrationDepth - k_slop, 0.0)
        let correctionVector = normal * (correctionAmount / totalInvMass) * percent
        
        if bodyA.type == .dynamic {
            bodyA.position -= correctionVector * invMassA
        }
        if bodyB.type == .dynamic {
            bodyB.position += correctionVector * invMassB
        }
        
        return penetrationDepth
    }
}
