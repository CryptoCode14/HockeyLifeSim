//
//  HockeyLifeSimApp.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

@main
struct HockeyLifeSimApp: App {
    @StateObject private var gameManager = GameManager()
    
    // ADDED: This delegate is necessary to control screen orientation.
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        _ = DatabaseManager.shared
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(gameManager)
        }
    }
}

// ADDED: This new class allows us to programmatically lock the orientation.
class AppDelegate: NSObject, UIApplicationDelegate {
    static var orientationLock = UIInterfaceOrientationMask.all

    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return Self.orientationLock
    }
}
