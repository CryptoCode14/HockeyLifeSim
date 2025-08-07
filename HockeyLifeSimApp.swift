//
//  HockeyLifeSimApp.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

@main
struct HockeyLifeSimApp: App {
    // Create the single source of truth for the game's state here.
    @StateObject private var gameManager = GameManager()

    init() {
        // This still correctly initializes the database once on app launch.
        _ = DatabaseManager.shared
    }

    var body: some Scene {
        WindowGroup {
            // Pass the gameManager into the environment of our root view.
            ContentView()
                .environmentObject(gameManager)
        }
    }
}
