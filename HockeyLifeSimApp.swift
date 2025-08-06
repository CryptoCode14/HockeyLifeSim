//
//  HockeyLifeSimApp.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

@main
struct HockeyLifeSimApp: App {

    // This init() function is called once when the app launches.
    // By calling DatabaseManager.shared, we trigger the initialization code
    // in the DatabaseManager's private init(), which sets up the database
    // and populates it from the CSV files on the first run.
    init() {
        _ = DatabaseManager.shared
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
