
//
//  Shape.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/7/25.
//

import Foundation
import CoreGraphics

/// A protocol that all geometric shapes must conform to.
protocol Shape {
    var type: ShapeType { get }
}

enum ShapeType {
    case circle, edge
}


/// A circle shape, defined by its radius.
struct CircleShape: Shape {
    let type: ShapeType = .circle
    var radius: CGFloat
}

/// An edge shape, defined by two endpoints. Perfect for walls.
struct EdgeShape: Shape {
    let type: ShapeType = .edge
    var vertex1: CGPoint
    var vertex2: CGPoint
}
