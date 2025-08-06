//
//  LifestyleItem..swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import Foundation

// NEW: Define ItemBonus here so LifestyleItem can see it.
struct ItemBonus: Codable {
    let skill: Player.Skill?
    let value: Int
    let description: String
}

struct LifestyleItem: Identifiable, Codable {
    let id: String
    let name: String
    let cost: Double
    let bonus: ItemBonus
}
