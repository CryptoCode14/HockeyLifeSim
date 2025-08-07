//
//  GameEventLog.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

//
//  GameEventLog.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation

/// Represents a single event that occurs during a game simulation.
struct GameEventLog: Codable, Identifiable {
    let id = UUID()
    
    // Game context
    let playerTeamName: String
    let opponentTeamName: String
    
    // Final score
    let finalPlayerScore: Int
    let finalOpponentScore: Int
    
    // Detailed play-by-play log
    let entries: [LogEntry]
    
    // Player's personal stats for this game
    let playerGoals: Int
    let playerAssists: Int
    let playerPIM: Int
    let playerPlusMinus: Int
    
    /// A single entry in the play-by-play log.
    struct LogEntry: Codable, Identifiable, Hashable {
        let id = UUID()
        let period: Int
        let time: String // e.g., "12:45"
        let description: String
        let isGoal: Bool
        let isPlayerTeamGoal: Bool
    }
}
