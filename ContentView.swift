//
//  ContentView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//
//
//  ContentView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct ContentView: View {
    // This view still correctly receives the GameManager from the App struct.
    @EnvironmentObject var gameManager: GameManager

    var body: some View {
        // Instead of performing the switch here, we delegate to a dedicated view.
        // This structural change isolates the logic and resolves the compiler error.
        GameFlowRouter()
    }
}

// This new view's sole responsibility is to read the game state and route to the correct screen.
struct GameFlowRouter: View {
    @EnvironmentObject var gameManager: GameManager
    
    var body: some View {
        switch gameManager.gameFlowState {
        case .creatingPlayer:
            PlayerCreationView()
        case .selectingSchool:
            HighSchoolSelectionView()
        case .inGame:
            MainGameView()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        // The preview also needs the environment object to work.
        ContentView()
            .environmentObject(GameManager())
    }
}
