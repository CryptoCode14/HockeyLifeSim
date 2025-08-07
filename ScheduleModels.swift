
//
//  ScheduleModels.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation

struct TeamInfo: Identifiable, Codable, Hashable {
    let id: Int64
    let name: String
    let rating: Int
}

struct ScheduledGame: Codable, Identifiable, Hashable {
    // FIXED: Changed to 'var' to silence Codable warning.
    var id = UUID()
    let gameDate: Date
    let opponent: TeamInfo
    var wasPlayed: Bool = false
    var gameResult: GameEventLog?

    static func == (lhs: ScheduledGame, rhs: ScheduledGame) -> Bool {
        return lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

struct GameSchedule: Codable {
    var games: [ScheduledGame]
}
