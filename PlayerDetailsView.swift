//
//  PlayerDetailsView.swift
//  HockeyLifeSim
//
//  Enhanced player details including injury history and awards
//

import SwiftUI

struct PlayerDetailsView: View {
    let player: Player
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            List {
                // Career Overview
                Section(header: Text("Career Overview")) {
                    HStack {
                        Text("Age")
                        Spacer()
                        Text("\(player.age)")
                    }
                    HStack {
                        Text("League")
                        Spacer()
                        Text(player.currentLeague.rawValue)
                    }
                    HStack {
                        Text("Team")
                        Spacer()
                        Text(player.teamName)
                    }
                    if let draft = player.draftDetails {
                        VStack(alignment: .leading) {
                            Text("Draft: \(draft.year)")
                            Text("\(draft.teamName) - Round \(draft.round), Pick \(draft.overallPick)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                // Awards
                if !player.awards.isEmpty {
                    Section(header: Text("🏆 Awards & Achievements")) {
                        ForEach(player.awards) { award in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(award.name)
                                        .font(.headline)
                                    Spacer()
                                    Text("\(award.year)")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                Text(award.description)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 2)
                        }
                    }
                }
                
                // Injury History
                if !player.injuryHistory.isEmpty {
                    Section(header: Text("⚕️ Injury History")) {
                        ForEach(player.injuryHistory.suffix(5).indices, id: \.self) { index in
                            let injury = player.injuryHistory.suffix(5)[index]
                            VStack(alignment: .leading, spacing: 4) {
                                Text(injury.description)
                                    .font(.headline)
                                Text("\(injury.type.rawValue) - \(injury.weeksRemaining) weeks")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 2)
                        }
                    }
                }
                
                // Current Status
                Section(header: Text("Current Status")) {
                    HStack {
                        Text("Morale")
                        Spacer()
                        Text("\(player.morale)")
                            .foregroundColor(moraleColor(player.morale))
                    }
                    HStack {
                        Text("Energy")
                        Spacer()
                        Text("\(player.energy)")
                            .foregroundColor(energyColor(player.energy))
                    }
                    if player.isAllStar {
                        HStack {
                            Text("⭐ All-Star")
                                .fontWeight(.bold)
                        }
                    }
                }
            }
            .navigationTitle("\(player.firstName) \(player.lastName)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func moraleColor(_ morale: Int) -> Color {
        switch morale {
        case 0..<25: return .red
        case 25..<50: return .orange
        case 50..<75: return .yellow
        default: return .green
        }
    }
    
    private func energyColor(_ energy: Int) -> Color {
        switch energy {
        case 0..<25: return .red
        case 25..<50: return .orange
        case 50..<75: return .yellow
        default: return .green
        }
    }
}
