//
//  ContentView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var gameManager = GameManager()

    var body: some View {
        Group {
            switch gameManager.gameFlowState {
            case .creatingPlayer:
                // This view handles player name input
                PlayerCreationView()
            case .selectingSchool:
                // This view shows the list of Minnesota High Schools
                HighSchoolSelectionView()
            case .inGame:
                // This shows your original UI, now encapsulated in MainGameView
                MainGameView()
            }
        }
        .environmentObject(gameManager)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
