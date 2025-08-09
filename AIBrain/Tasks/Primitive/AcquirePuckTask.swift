//  AcquirePuckTask.swift
import Foundation

struct AcquirePuckTask: PrimitiveTask {
    let name = "AcquirePuck"
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus {
        guard scene.puckCarrier == nil else { return .failure }
        
        if let puckBody = scene.puckBody, (puckBody.position - agent.body.position).length() < 3.0 {
            scene.puckCarrier = agent.body
            print("\(agent.body.userData?.name ?? "Player") acquired the puck.")
            return .success
        }
        return .failure
    }
}
