//
//  EndOfSeasonView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI
struct EndOfSeasonView: View {
    @EnvironmentObject var gameManager: GameManager
    var body: some View {
        VStack(spacing: 20) {
            Text("Season Complete!").font(.largeTitle).bold()
            Text("Your Final Stats:").font(.headline)
            HStack(spacing: 25) {
                VStack { Text("\(gameManager.player.goals)").font(.title).bold(); Text("Goals").font(.caption) }
                VStack { Text("\(gameManager.player.assists)").font(.title).bold(); Text("Assists").font(.caption) }
                VStack { Text("\(gameManager.player.points)").font(.title).bold(); Text("Points").font(.caption) }
            }.padding().background(Color(.secondarySystemBackground)).cornerRadius(10)
            Text("Based on your performance, you have received the following offers:").font(.headline).padding(.horizontal)
            ForEach(gameManager.availablePaths, id: \.self) { league in
                Button(action: { gameManager.selectCareerPath(league: league) }) {
                    Text("Join \(league.rawValue)").fontWeight(.bold).frame(maxWidth: .infinity).padding().background(Color.blue).foregroundColor(.white).cornerRadius(10)
                }
            }
            Spacer()
        }.padding()
    }
}
