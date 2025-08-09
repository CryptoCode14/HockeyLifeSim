//  IdleTask.swift
import Foundation

struct IdleTask: PrimitiveTask {
    let name = "Idle"
    func execute(on agent: AIAgent, in scene: GameScene) -> TaskStatus {
        agent.body.velocity *= 0.95
        return .success
    }
}
