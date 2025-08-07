
//  PlayerArchetype.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/6/25.
//

import Foundation

// Defines the different styles of play for forwards
enum ForwardArchetype: CaseIterable {
    case playmaker, sniper, grinder
}

// Defines the different styles of play for defensemen
enum DefensemanArchetype: CaseIterable {
    case offensive, defensive
}

// A container to hold the archetype for any given player
enum PlayerArchetype {
    case forward(ForwardArchetype)
    case defenseman(DefensemanArchetype)
}
