

//
//  ScheduleGenerator.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation

class ScheduleGenerator {
    
    static func generate(for playerTeam: TeamInfo, in leagueId: Int64, seasonStartDate: Date) -> GameSchedule {
        let allTeamsInLeague = DatabaseManager.shared.getTeamsForLeague(id: leagueId)
        let opponents = allTeamsInLeague.filter { $0.id != playerTeam.id }
        
        guard !opponents.isEmpty else {
            print("⚠️ No opponents found for league \(leagueId). Cannot generate schedule.")
            return GameSchedule(games: [])
        }
        
        var scheduledGames: [ScheduledGame] = []
        var gameDate = seasonStartDate
        let calendar = Calendar.current
        
        let gamesPerOpponent = 4
        
        var matchups: [TeamInfo] = []
        for opponent in opponents {
            for _ in 1...gamesPerOpponent {
                matchups.append(opponent)
            }
        }
        matchups.shuffle()
        
        for opponent in matchups {
            scheduledGames.append(ScheduledGame(gameDate: gameDate, opponent: opponent))
            
            if calendar.component(.weekday, from: gameDate) < 5 {
                gameDate = calendar.date(byAdding: .day, value: 3, to: gameDate) ?? gameDate
            } else {
                gameDate = calendar.date(byAdding: .day, value: 4, to: gameDate) ?? gameDate
            }
        }
        
        scheduledGames.sort { $0.gameDate < $1.gameDate }
        
        return GameSchedule(games: scheduledGames)
    }
}
