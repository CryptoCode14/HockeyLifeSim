//
//  WeeklyScheduleView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct WeeklyScheduleView: View {
    // MODIFIED: This view now gets all its data from the shared GameManager.
    @EnvironmentObject var gameManager: GameManager
    @Environment(\.dismiss) var dismiss
    
    // The list of all possible skills a player can train.
    private let allSkills = Player.Skill.allCases

    var body: some View {
        NavigationView {
            VStack {
                TrainingFocusView(
                    allSkills: allSkills,
                    selectedSkills: gameManager.weeklyTrainingFocus
                ) { skill in
                    // This logic handles selecting/deselecting training focuses.
                    if gameManager.weeklyTrainingFocus.contains(skill) {
                        gameManager.weeklyTrainingFocus.removeAll { $0 == skill }
                    } else if gameManager.weeklyTrainingFocus.count < 2 {
                        gameManager.weeklyTrainingFocus.append(skill)
                    }
                }
                
                Spacer()
                
                Button(action: {
                    // MODIFIED: The button now calls the advanceOneWeek function on the GameManager.
                    gameManager.advanceOneWeek()
                    dismiss() // This closes the sheet after the week is simulated.
                }) {
                    Text("Simulate Week")
                        .font(.headline)
                        .fontWeight(.bold)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding()
            }
            .navigationTitle("Plan Your Week")
            .navigationBarItems(leading: Button("Cancel") {
                dismiss()
            })
        }
    }
}

// This helper view is now cleaner and more self-contained.
struct TrainingFocusView: View {
    let allSkills: [Player.Skill]
    let selectedSkills: [Player.Skill]
    let onSelectSkill: (Player.Skill) -> Void

    var body: some View {
        VStack(alignment: .leading) {
            Text("Select Up to 2 Training Focuses")
                .font(.headline)
                .padding(.horizontal)
            
            // Using a LazyVGrid to display the skills in a clean, adaptive grid.
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))], spacing: 10) {
                ForEach(allSkills, id: \.self) { skill in
                    Button(action: {
                        onSelectSkill(skill)
                    }) {
                        Text(skill.rawValue)
                            .fontWeight(.semibold)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(selectedSkills.contains(skill) ? Color.accentColor : Color(.systemGray5))
                            .foregroundColor(selectedSkills.contains(skill) ? .white : .primary)
                            .cornerRadius(8)
                    }
                }
            }
            .padding()
        }
    }
}

// MODIFIED: The preview now correctly injects a GameManager.
struct WeeklyScheduleView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyScheduleView()
            .environmentObject(GameManager())
    }
}
