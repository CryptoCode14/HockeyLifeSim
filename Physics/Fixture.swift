//
//  Fixture.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

/// A fixture binds a shape to a body and adds material properties.
class Fixture {
    // A reference back to the body this fixture is attached to.
    unowned let body: Body
    
    let shape: Shape
    
    // --- Material Properties ---
    
    /// The density, usually in kg/m^2. Density is used to compute the mass of the parent body.
    var density: CGFloat
    
    /// The friction coefficient, usually in the range [0,1].
    var friction: CGFloat
    
    /// The restitution (bounciness) of the fixture, usually in the range [0,1].
    var restitution: CGFloat
    
    init(body: Body, shape: Shape, density: CGFloat = 1.0, friction: CGFloat = 0.3, restitution: CGFloat = 0.2) {
        self.body = body
        self.shape = shape
        self.density = density
        self.friction = friction
        self.restitution = restitution
    }
}
