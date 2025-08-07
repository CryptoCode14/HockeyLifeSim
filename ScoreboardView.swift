//
//  ScoreboardView.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/6/25.
//

import SwiftUI

struct ScoreboardView: View {
    let playerTeamName: String
    let opponentTeamName: String
    let playerScore: Int
    let opponentScore: Int
    let period: String
    let clock: String
    
    // UPDATED: These now accept live data from the parent view.
    let playerSOG: Int
    let opponentSOG: Int
    let powerPlayTime: String? // e.g., "1:45" or nil if no power play
    let isPlayerTeamOnPP: Bool
    
    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                TeamScoreView(teamName: playerTeamName, score: playerScore, alignment: .leading)
                Spacer()
                VStack {
                    Text(period)
                        .fontWeight(.bold)
                    Text(clock)
                        .font(.system(size: 24, weight: .bold, design: .monospaced))
                }
                .foregroundColor(.white)
                Spacer()
                TeamScoreView(teamName: opponentTeamName, score: opponentScore, alignment: .trailing)
            }
            .padding(.horizontal)
            .frame(height: 60)
            .background(.black.opacity(0.8))
            .cornerRadius(12, corners: [.topLeft, .topRight])
            
            HStack {
                Text("SOG: \(playerSOG)")
                Spacer()
                
                // UPDATED: This logic now correctly displays the power play indicator.
                if let ppTime = powerPlayTime {
                    HStack {
                        Text(isPlayerTeamOnPP ? playerTeamName : opponentTeamName)
                            .fontWeight(.bold)
                        Text("PP")
                            .font(.caption.bold())
                            .foregroundColor(.black)
                            .padding(.horizontal, 4)
                            .background(Color.yellow)
                            .cornerRadius(4)
                        Text(ppTime)
                            .font(.system(.callout, design: .monospaced).bold())
                    }
                }
                
                Spacer()
                Text("SOG: \(opponentSOG)")
            }
            .font(.callout)
            .foregroundColor(.white.opacity(0.9))
            .padding(.horizontal)
            .frame(height: 25)
            .background(.black.opacity(0.6))
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .padding(.horizontal)
    }
}

// (TeamScoreView, View+cornerRadius, and RoundedCorner structs remain unchanged)
struct TeamScoreView: View {
    let teamName: String
    let score: Int
    let alignment: HorizontalAlignment
    
    var body: some View {
        HStack {
            if alignment == .trailing { Spacer() }
            
            VStack(alignment: alignment) {
                Text(teamName.uppercased())
                    .font(.headline)
                    .fontWeight(.heavy)
                
                Image(systemName: "hockey.puck.fill")
                    .font(.title2)
            }
            .foregroundColor(.white)
            
            Text("\(score)")
                .font(.system(size: 40, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            
            if alignment == .leading { Spacer() }
        }
    }
}

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape( RoundedCorner(radius: radius, corners: corners) )
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}


struct ScoreboardView_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Color.gray
            ScoreboardView(
                playerTeamName: "RIV",
                opponentTeamName: "WTN",
                playerScore: 1,
                opponentScore: 3,
                period: "3rd",
                clock: "03:23",
                playerSOG: 22,
                opponentSOG: 18,
                powerPlayTime: "1:21",
                isPlayerTeamOnPP: false
            )
        }
    }
}
