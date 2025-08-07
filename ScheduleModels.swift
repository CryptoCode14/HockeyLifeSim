
//
//  ScheduleModels.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation

/// Represents basic info for any team. Conforms to Codable to be saveable.
struct TeamInfo: Identifiable, Codable, Hashable {
    let id: Int64
    let name: String
    let rating: Int
}

/// Represents a single game on the schedule against a specific opponent.
struct ScheduledGame: Codable, Identifiable, Hashable {
    let id = UUID()
    let gameDate: Date
    let opponent: TeamInfo
    var wasPlayed: Bool = false
    var gameResult: GameEventLog?

    // Manually implement Hashable because GameEventLog is not Hashable
    static func == (lhs: ScheduledGame, rhs: ScheduledGame) -> Bool {
        return lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

/// A simple container for the entire season's schedule.
struct GameSchedule: Codable {
    var games: [ScheduledGame]
}
