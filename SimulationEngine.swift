//
//  SimulationEngine.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/5/25.
//

import Foundation
import CoreGraphics

class SimulationEngine {
    static let shared = SimulationEngine()
    private init() {}

    // MARK: - Rink Constants
    // FIXED: Corrected goal positions to be in the crease.
    private let rinkBounds = CGRect(x: 25, y: 25, width: 950, height: 800)
    private let playerGoalPos = CGPoint(x: 80, y: 425)
    private let opponentGoalPos = CGPoint(x: 920, y: 425)
    private let centerIce = CGPoint(x: 500, y: 425)
    private let friction: CGFloat = 0.98

    // MARK: - Public Functions
    func createGame(playerTeam: TeamInfo, opponent: TeamInfo) -> LiveGameSession {
        var session = LiveGameSession(skaters: [], goalies: [], puck: .init(position: centerIce))
        let allPlayers = createInitialPlayers(pTeam: playerTeam, oTeam: opponent)
        session.skaters = allPlayers.filter { $0.role != "G" }
        session.goalies = allPlayers.filter { $0.role == "G" }
        positionForFaceoff(session: &session)
        return session
    }

    func advance(session: LiveGameSession) -> LiveGameSession {
        var next = session
        
        if next.situation == .faceoff {
            handleFaceoff(session: &next)
        } else {
            updateGoaliePositions(session: &next)
            updateSkaterPositions(session: &next)
            updatePuck(session: &next)
        }
        
        if next.gameTime <= 0 && next.period < 3 {
            next.period += 1; next.gameTime = 1200; next.situation = .faceoff
            positionForFaceoff(session: &next)
        }
        return next
    }
    
    // MARK: - Core Logic
    private func updateGoaliePositions(session: inout LiveGameSession) {
        for i in 0..<session.goalies.count {
            let goalie = session.goalies[i]
            let goalPos = goalie.teamId == session.skaters[0].teamId ? playerGoalPos : opponentGoalPos
            let targetY = max(goalPos.y - 60, min(goalPos.y + 60, session.puck.position.y))
            let target = CGPoint(x: goalPos.x, y: targetY)
            
            let dx = target.x - goalie.position.x; let dy = target.y - goalie.position.y
            session.goalies[i].position.x += dx * 0.2
            session.goalies[i].position.y += dy * 0.2
        }
    }

    private func updateSkaterPositions(session: inout LiveGameSession) {
        for i in 0..<session.skaters.count {
            let skater = session.skaters[i]
            let target = calculateAITarget(for: skater, in: session)
            
            let dx = target.x - skater.position.x
            let dy = target.y - skater.position.y
            let distance = sqrt(dx*dx + dy*dy)
            // FIXED: Increased skater speed for a more realistic feel.
            let speed: CGFloat = 20.0
            
            if distance > 1 {
                session.skaters[i].position.x += (dx / distance) * speed
                session.skaters[i].position.y += (dy / distance) * speed
            }
        }
    }
    
    private func calculateAITarget(for player: LiveGameSession.PlayerState, in session: LiveGameSession) -> CGPoint {
        let ownGoal = player.teamId == session.skaters[0].teamId ? playerGoalPos : opponentGoalPos
        let opponentGoal = player.teamId == session.skaters[0].teamId ? opponentGoalPos : playerGoalPos
        
        if let puckOwner = session.puck.owner, puckOwner.teamId == player.teamId {
             // Offensive AI: Simplified to move to smart areas
            if puckOwner.id == player.id { return opponentGoal }
            else { return CGPoint(x: opponentGoal.x - 150, y: player.position.y) }
        } else {
            // Defensive AI: Pressure the puck
            return session.puck.position
        }
    }

    private func updatePuck(session: inout LiveGameSession) {
        if let owner = session.puck.owner, let ownerState = session.skaters.first(where: { $0.id == owner.id }) {
            session.puck.position = CGPoint(x: ownerState.position.x + 15, y: ownerState.position.y)
            session.puck.velocity = .zero
            session.description = "\(owner.role) has the puck."
            
            let opponentGoal = owner.teamId == session.skaters[0].teamId ? opponentGoalPos : playerGoalPos
            if distance(owner.position, opponentGoal) < 400 && Double.random(in: 0...1) < 0.1 {
                session.puck.owner = nil
                let shotVector = CGVector(dx: opponentGoal.x - owner.position.x, dy: opponentGoal.y - owner.position.y)
                // FIXED: Increased shot and pass velocity
                session.puck.velocity = scale(vector: shotVector, to: Double.random(in: 50...70))
                session.description = "Shot by \(owner.role)!"
            }
        } else {
            session.puck.position.x += session.puck.velocity.dx
            session.puck.position.y += session.puck.velocity.dy
            session.puck.velocity.dx *= friction
            session.puck.velocity.dy *= friction
            
            // FIXED: Added board physics to confine the puck.
            if session.puck.position.x < rinkBounds.minX || session.puck.position.x > rinkBounds.maxX {
                session.puck.velocity.dx *= -0.8 // Reverse direction with some energy loss
                session.puck.position.x = max(rinkBounds.minX, min(rinkBounds.maxX, session.puck.position.x))
            }
            if session.puck.position.y < rinkBounds.minY || session.puck.position.y > rinkBounds.maxY {
                session.puck.velocity.dy *= -0.8
                session.puck.position.y = max(rinkBounds.minY, min(rinkBounds.maxY, session.puck.position.y))
            }
            
            if let closestSkater = session.skaters.min(by: { distance(session.puck.position, $0.position) < distance(session.puck.position, $1.position) }) {
                if distance(session.puck.position, closestSkater.position) < 25 {
                    session.puck.owner = closestSkater
                }
            }
            
            for goalie in session.goalies {
                if distance(session.puck.position, goalie.position) < 30 {
                    session.puck.velocity = .zero
                    session.description = "Save by the goalie!"
                }
            }
        }
    }
    
    // MARK: - Setup and Utility
    private func handleFaceoff(session: inout LiveGameSession) {
        let winningTeamId = Bool.random() ? session.skaters[0].teamId : session.skaters[5].teamId
        if let center = session.skaters.first(where: { $0.teamId == winningTeamId && $0.role == "C" }) {
            session.puck.owner = center
        }
        session.situation = .inPlay
    }
    
    private func createInitialPlayers(pTeam: TeamInfo, oTeam: TeamInfo) -> [LiveGameSession.PlayerState] {
        return [
            .init(teamId: pTeam.id, role: "LW", archetype: .forward(.playmaker), position: .zero), .init(teamId: pTeam.id, role: "C", archetype: .forward(.sniper), position: .zero),
            .init(teamId: pTeam.id, role: "RW", archetype: .forward(.grinder), position: .zero), .init(teamId: pTeam.id, role: "LD", archetype: .defenseman(.offensive), position: .zero),
            .init(teamId: pTeam.id, role: "RD", archetype: .defenseman(.defensive), position: .zero), .init(teamId: pTeam.id, role: "G", archetype: .defenseman(.defensive), position: .zero),
            .init(teamId: oTeam.id, role: "LW", archetype: .forward(.grinder), position: .zero), .init(teamId: oTeam.id, role: "C", archetype: .forward(.playmaker), position: .zero),
            .init(teamId: oTeam.id, role: "RW", archetype: .forward(.sniper), position: .zero), .init(teamId: oTeam.id, role: "LD", archetype: .defenseman(.defensive), position: .zero),
            .init(teamId: oTeam.id, role: "RD", archetype: .defenseman(.offensive), position: .zero), .init(teamId: oTeam.id, role: "G", archetype: .defenseman(.defensive), position: .zero),
        ]
    }
    
    private func positionForFaceoff(session: inout LiveGameSession) {
        let pot = centerIce
        session.puck.position = pot; session.puck.owner = nil
        
        for i in 0..<session.goalies.count {
            let goalie = session.goalies[i]; let isPlayerTeam = goalie.teamId == session.skaters[0].teamId
            session.goalies[i].position = isPlayerTeam ? playerGoalPos : opponentGoalPos
        }
        
        for i in 0..<session.skaters.count {
            let skater = session.skaters[i]; let isPlayerTeam = skater.teamId == session.skaters[0].teamId
            let xSide: CGFloat = isPlayerTeam ? -1 : 1
            switch skater.role {
            case "C": session.skaters[i].position = CGPoint(x: pot.x + (10 * xSide), y: pot.y)
            case "LW": session.skaters[i].position = CGPoint(x: pot.x + (70 * xSide), y: pot.y - 200)
            case "RW": session.skaters[i].position = CGPoint(x: pot.x + (70 * xSide), y: pot.y + 200)
            case "LD": session.skaters[i].position = CGPoint(x: pot.x - (150 * xSide), y: pot.y - 150)
            case "RD": session.skaters[i].position = CGPoint(x: pot.x - (150 * xSide), y: pot.y + 150)
            default: break
            }
        }
    }
    
    private func distance(_ a: CGPoint, _ b: CGPoint) -> CGFloat { sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2)) }
    private func scale(vector: CGVector, to magnitude: CGFloat) -> CGVector {
        let currentMagnitude = sqrt(vector.dx*vector.dx + vector.dy*vector.dy)
        if currentMagnitude == 0 { return .zero }
        let scaleFactor = magnitude / currentMagnitude
        return CGVector(dx: vector.dx * scaleFactor, dy: vector.dy * scaleFactor)
    }
}
