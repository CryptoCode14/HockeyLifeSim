//
//  GameEventLog.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation
import CoreGraphics

// The top-level container for a completed game's data
struct GameEventLog: Codable, Identifiable {
    var id = UUID()
    let playerTeamName: String
    let opponentTeamName: String
    let entries: [LogEntry]
    // Final stats can be derived from the last log entry
}

// Represents a single "tick" or snapshot of the entire game state
struct LogEntry: Codable, Identifiable {
    var id = UUID()
    let time: String
    let period: Int
    let description: String
    
    // Scoreboard Data
    let playerScore: Int
    let opponentScore: Int
    let playerSOG: Int
    let opponentSOG: Int
    
    // On-Ice Data
    let puckState: PuckState
    let playerStates: [PlayerState]
}

// Holds the state for an individual player
struct PlayerState: Codable, Identifiable {
    var id: String { role + teamId.description } // Stable ID for ForEach
    let teamId: Int64
    let role: String // C, LW, RW, LD, RD, G
    let position: CGPoint
}

// Holds the state for the puck
struct PuckState: Codable {
    let position: CGPoint
    let carriedByTeamId: Int64?
}
