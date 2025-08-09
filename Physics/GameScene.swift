//
//  GameScene.swift
//  HockeyLifeSim
//
//  Created by Brian Google on anuary 9, 2025.
//

import Foundation
import Combine
import CoreGraphics

class GameScene: ObservableObject {
    @Published var world: World
    private var timer: AnyCancellable?
    
    let homeTeam: TeamInfo
    let awayTeam: TeamInfo
    
    private var agents: [AIAgent] = []
    private let domain = HTNDomain()

    var puckBody: Body? {
        return world.bodies.first { $0.userData?.name == "puck" }
    }
    var puckCarrier: Body?

    @Published var gameTime: TimeInterval = 1200
    @Published var period: Int = 1
    @Published var homeScore: Int = 0
    @Published var awayScore: Int = 0
    @Published var homeSOG: Int = 0
    @Published var awaySOG: Int = 0

    private let rinkWidth: CGFloat = 200.0
    private let rinkHeight: CGFloat = 85.0

    init(homeTeam: TeamInfo, awayTeam: TeamInfo) {
        self.world = World(gravity: .zero)
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam

        createRink()
        createPlayers()
        createPuck()
        
        if let homeCenterAgent = agents.first(where: { $0.body.userData?.name == "home_player_C" }) {
            let targetPosition = CGPoint(x: rinkWidth - 20, y: rinkHeight / 2)
            
            let setTarget = SetBlackboardValueTask(key: "targetPosition", value: targetPosition)
            let skateTask = domain.getTask(named: "SkateToPosition")! as! PrimitiveTask
            
            homeCenterAgent.highLevelTask = PrimitiveTaskSequence(tasks: [setTarget, skateTask])
        }
    }

    func start() {
        timer = Timer.publish(every: 1.0 / 60.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                
                for agent in self.agents {
                    agent.update(in: self)
                }
                
                if let carrier = self.puckCarrier, let puck = self.puckBody {
                    puck.position = carrier.position
                    puck.velocity = carrier.velocity
                }
                
                self.world.step(in: self, deltaTime: 1.0 / 60.0)
                self.objectWillChange.send()
            }
    }

    func stop() {
        timer?.cancel()
    }
    
    // MARK: - Object Creation
    
    private func createRink() {
        let rinkBody = world.createBody(type: .static, position: .zero)
        rinkBody.userData = BodyUserData(name: "rink")
        let points = [
            CGPoint(x: 0, y: 0), CGPoint(x: rinkWidth, y: 0),
            CGPoint(x: rinkWidth, y: rinkHeight), CGPoint(x: 0, y: rinkHeight),
            CGPoint(x: 0, y: 0)
        ]
        for i in 0..<(points.count - 1) {
            let edge = EdgeShape(vertex1: points[i], vertex2: points[i+1])
            rinkBody.add(fixture: Fixture(body: rinkBody, shape: edge, restitution: 0.6))
        }
    }
    
    private func createPlayers() {
        let centerIce = CGPoint(x: rinkWidth / 2, y: rinkHeight / 2)
        
        createPlayer(team: "home", position: CGPoint(x: centerIce.x - 5, y: centerIce.y), role: "C")
        createPlayer(team: "home", position: CGPoint(x: centerIce.x - 40, y: centerIce.y - 30), role: "LW")
        createPlayer(team: "home", position: CGPoint(x: centerIce.x - 40, y: centerIce.y + 30), role: "RW")
        createPlayer(team: "home", position: CGPoint(x: 35, y: centerIce.y - 25), role: "LD")
        createPlayer(team: "home", position: CGPoint(x: 35, y: centerIce.y + 25), role: "RD")
        createGoalie(team: "home", position: CGPoint(x: 11, y: centerIce.y))

        createPlayer(team: "away", position: CGPoint(x: centerIce.x + 5, y: centerIce.y), role: "C")
        createPlayer(team: "away", position: CGPoint(x: centerIce.x + 40, y: centerIce.y - 30), role: "LW")
        createPlayer(team: "away", position: CGPoint(x: centerIce.x + 40, y: centerIce.y + 30), role: "RW")
        createPlayer(team: "away", position: CGPoint(x: rinkWidth - 35, y: centerIce.y - 25), role: "LD")
        createPlayer(team: "away", position: CGPoint(x: rinkWidth - 35, y: centerIce.y + 25), role: "RD")
        createGoalie(team: "away", position: CGPoint(x: rinkWidth - 11, y: centerIce.y))
    }

    private func createPlayer(team: String, position: CGPoint, role: String) {
        let playerBody = world.createBody(type: .dynamic, position: position)
        playerBody.userData = BodyUserData(name: "\(team)_player_\(role)")
        playerBody.add(fixture: Fixture(body: playerBody, shape: CircleShape(radius: 2.5), density: 85.0, friction: 0.8, restitution: 0.4))
        
        let agent = AIAgent(body: playerBody, domain: self.domain)
        agents.append(agent)
    }
    
    private func createGoalie(team: String, position: CGPoint, role: String = "G") {
        let goalieBody = world.createBody(type: .dynamic, position: position)
        goalieBody.userData = BodyUserData(name: "\(team)_player_\(role)")
        goalieBody.add(fixture: Fixture(body: goalieBody, shape: CircleShape(radius: 2.5), density: 85.0, friction: 0.8, restitution: 0.4))
        
        let agent = AIAgent(body: goalieBody, domain: self.domain)
        agents.append(agent)
    }

    private func createPuck() {
        let puckBody = world.createBody(type: .dynamic, position: CGPoint(x: rinkWidth / 2, y: rinkHeight / 2))
        puckBody.userData = BodyUserData(name: "puck")
        puckBody.add(fixture: Fixture(body: puckBody, shape: CircleShape(radius: 0.5), density: 0.17, friction: 0.05, restitution: 0.85))
    }
}
