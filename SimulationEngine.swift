//
//  SimulationEngine.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

//
//  SimulationEngine.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation

class SimulationEngine {
    
    private enum GameState {
        case evenStrength, playerPowerPlay, opponentPowerPlay
    }
    
    static let shared = SimulationEngine()
    private init() {}
    
    // MARK: - Main Simulation Function
    func simulateGame(player: Player, playerTeam: TeamInfo, opponent: TeamInfo) -> GameEventLog {
        // --- Game State Variables ---
        var log: [GameEventLog.LogEntry] = []
        var playerTeamScore = 0
        var opponentScore = 0
        var gameState: GameState = .evenStrength
        var powerPlayTime = 0
        var playerShiftTime = Int.random(in: 1...30) // Stagger player start
        var isPlayerOnIce = false
        
        // --- Player Game Stats ---
        var pGoals = 0, pAssists = 0, pPim = 0, pPlusMinus = 0
        
        for period in 1...3 {
            var timeRemaining = 1200 // 20 minutes in seconds
            log.append(createLog(period: period, time: timeRemaining, description: "Period \(period) begins."))

            while timeRemaining > 0 {
                // --- UPDATE TIMERS ---
                let timeElapsed = Int.random(in: 10...25)
                timeRemaining -= timeElapsed
                playerShiftTime -= timeElapsed
                if powerPlayTime > 0 {
                    powerPlayTime = max(0, powerPlayTime - timeElapsed)
                    if powerPlayTime == 0 {
                        log.append(createLog(period: period, time: timeRemaining, description: "Penalty expires. Teams are at even strength."))
                        gameState = .evenStrength
                    }
                }
                
                // --- SHIFT CHANGE LOGIC ---
                if playerShiftTime <= 0 {
                    isPlayerOnIce.toggle()
                    playerShiftTime = isPlayerOnIce ? 45 : 90 // 45s on, 90s off
                    log.append(createLog(period: period, time: timeRemaining, description: "\(player.name) hops \(isPlayerOnIce ? "over the boards." : "onto the bench.")"))
                }

                // --- EVENT DETERMINATION ---
                var teamDrivingPlay = determineDrivingTeam(playerTeam, opponent, gameState)
                
                let eventChance = Int.random(in: 1...100)
                if eventChance > 80 { // PENALTY
                    let penalizedTeam = Bool.random() ? playerTeam.name : opponent.name
                    log.append(createLog(period: period, time: timeRemaining, description: "PENALTY on \(penalizedTeam). 2 minutes for Tripping."))
                    if penalizedTeam == playerTeam.name {
                        gameState = .opponentPowerPlay
                        if isPlayerOnIce { pPim += 2 }
                    } else {
                        gameState = .playerPowerPlay
                    }
                    powerPlayTime = 120
                } else if eventChance > 50 { // SCORING CHANCE
                    let (goal, scorer, assist) = processScoringChance(for: teamDrivingPlay, player: player, playerTeam: playerTeam, opponent: opponent, isPlayerOnIce: isPlayerOnIce, gameState: gameState)
                    if goal {
                        log.append(createLog(period: period, time: timeRemaining, description: "🚨 GOAL \(teamDrivingPlay.name)! Scored by \(scorer), assist by \(assist).", isGoal: true, isPlayerTeamGoal: teamDrivingPlay.id == playerTeam.id))
                        if teamDrivingPlay.id == playerTeam.id {
                            playerTeamScore += 1
                            if isPlayerOnIce && gameState == .evenStrength { pPlusMinus += 1 }
                            if scorer == player.name { pGoals += 1 }
                            if assist == player.name { pAssists += 1 }
                        } else {
                            opponentScore += 1
                            if isPlayerOnIce && gameState == .evenStrength { pPlusMinus -= 1 }
                        }
                    } else {
                        log.append(createLog(period: period, time: timeRemaining, description: "Shot by \(teamDrivingPlay.name), save!"))
                    }
                } else { // NEUTRAL ZONE
                     log.append(createLog(period: period, time: timeRemaining, description: "Battle for the puck in the neutral zone."))
                }
            }
            log.append(createLog(period: period, time: 0, description: "End of Period \(period)."))
        }
        
        log.append(createLog(period: 3, time: 0, description: "--- FINAL SCORE: \(playerTeam.name) \(playerTeamScore) - \(opponent.name) \(opponentScore) ---"))
        
        return GameEventLog(playerTeamName: playerTeam.name, opponentTeamName: opponent.name, finalPlayerScore: playerTeamScore, finalOpponentScore: opponentScore, entries: log, playerGoals: pGoals, playerAssists: pAssists, playerPIM: pPim, playerPlusMinus: pPlusMinus)
    }

    // MARK: - Private Simulation Helpers
    private func determineDrivingTeam(_ pTeam: TeamInfo, _ oTeam: TeamInfo, _ state: GameState) -> TeamInfo {
        var playerTeamAdvantage = pTeam.rating - oTeam.rating
        switch state {
        case .playerPowerPlay: playerTeamAdvantage += 20
        case .opponentPowerPlay: playerTeamAdvantage -= 20
        case .evenStrength: break
        }
        return Int.random(in: 1...100) + playerTeamAdvantage > 50 ? pTeam : oTeam
    }
    
    private func processScoringChance(for team: TeamInfo, player: Player, playerTeam: TeamInfo, opponent: TeamInfo, isPlayerOnIce: Bool, gameState: GameState) -> (Bool, String, String) {
        let isPlayerTeamChance = team.id == playerTeam.id
        let offense = isPlayerTeamChance ? playerTeam.rating : opponent.rating
        let defense = isPlayerTeamChance ? opponent.rating : playerTeam.rating
        
        let goalRoll = Int.random(in: 1...100) + (offense - defense) / 2
        if goalRoll > 85 { // It's a goal!
            var scorer = "Teammate"
            var assist = "Teammate"
            if isPlayerTeamChance && isPlayerOnIce { // Player's team scored while player on ice
                if Int.random(in: 1...100) + (player.skills[.shootingAccuracy]! / 2) > 80 { scorer = player.name }
                else if Int.random(in: 1...100) + (player.skills[.passing]! / 2) > 75 { assist = player.name }
            }
            return (true, scorer, assist)
        }
        return (false, "", "") // No goal
    }
    
    private func formatTime(seconds: Int) -> String {
        let min = max(0, seconds / 60)
        let sec = max(0, seconds % 60)
        return String(format: "%02d:%02d", min, sec)
    }
    
    private func createLog(period: Int, time: Int, description: String, isGoal: Bool = false, isPlayerTeamGoal: Bool = false) -> GameEventLog.LogEntry {
        return GameEventLog.LogEntry(period: period, time: formatTime(seconds: time), description: description, isGoal: isGoal, isPlayerTeamGoal: isPlayerTeamGoal)
    }
}
