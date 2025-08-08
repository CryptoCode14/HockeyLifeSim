//
//  VectorMath.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

// Defines a complete set of operator overloads for CoreGraphics types
// to make vector math clean and readable in the physics engine.

// MARK: - CGVector Operators
extension CGVector {
    static func + (lhs: CGVector, rhs: CGVector) -> CGVector {
        return CGVector(dx: lhs.dx + rhs.dx, dy: lhs.dy + rhs.dy)
    }

    static func - (lhs: CGVector, rhs: CGVector) -> CGVector {
        return CGVector(dx: lhs.dx - rhs.dx, dy: lhs.dy - rhs.dy)
    }

    static func * (vector: CGVector, scalar: CGFloat) -> CGVector {
        return CGVector(dx: vector.dx * scalar, dy: vector.dy * scalar)
    }
    
    // ADDED: Compound multiplication operator
    static func *= (lhs: inout CGVector, rhs: CGFloat) {
        lhs = lhs * rhs
    }

    static func / (vector: CGVector, scalar: CGFloat) -> CGVector {
        guard scalar != 0 else { return .zero }
        return CGVector(dx: vector.dx / scalar, dy: vector.dy / scalar)
    }

    static func += (lhs: inout CGVector, rhs: CGVector) {
        lhs = lhs + rhs
    }

    static func -= (lhs: inout CGVector, rhs: CGVector) {
        lhs = lhs - rhs
    }

    func length() -> CGFloat {
        return sqrt(dx*dx + dy*dy)
    }
    
    func lengthSquared() -> CGFloat {
        return dx*dx + dy*dy
    }

    func normalized() -> CGVector {
        let len = self.length()
        if len > 0 {
            return self / len
        }
        return .zero
    }
    
    func dot(_ other: CGVector) -> CGFloat {
        return self.dx * other.dx + self.dy * other.dy
    }
}

// MARK: - CGPoint Operators
extension CGPoint {
    static func + (lhs: CGPoint, rhs: CGVector) -> CGPoint {
        return CGPoint(x: lhs.x + rhs.dx, y: lhs.y + rhs.dy)
    }

    static func - (lhs: CGPoint, rhs: CGVector) -> CGPoint {
        return CGPoint(x: lhs.x - rhs.dx, y: lhs.y - rhs.dy)
    }
    
    // ADDED: Define subtraction between two points to get a direction vector.
    static func - (lhs: CGPoint, rhs: CGPoint) -> CGVector {
        return CGVector(dx: lhs.x - rhs.x, dy: lhs.y - rhs.y)
    }
    
    static func += (lhs: inout CGPoint, rhs: CGVector) {
        lhs = lhs + rhs
    }

    static func -= (lhs: inout CGPoint, rhs: CGVector) {
        lhs = lhs - rhs
    }
}
