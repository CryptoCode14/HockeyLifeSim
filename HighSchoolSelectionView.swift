//
//  HighSchoolSelectionView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import SwiftUI

// MODIFIED: The struct now correctly includes the 'rating' property.
struct TeamInfo: Identifiable {
    let id: Int64
    let name: String
    let rating: Int
}

struct HighSchoolSelectionView: View {
    @EnvironmentObject var gameManager: GameManager
    @State private var highSchools: [TeamInfo] = []
    @State private var searchText: String = ""

    var body: some View {
        NavigationView {
            VStack {
                SearchBar(text: $searchText)
                
                List(filteredSchools) { school in
                    Button(action: {
                        gameManager.selectTeam(teamID: Int(school.id), teamName: school.name)
                    }) {
                        HStack {
                            Text(school.name)
                            Spacer()
                            StarRatingView(rating: stars(for: school.rating))
                        }
                    }
                    .foregroundColor(.primary)
                }
            }
            .navigationTitle("Choose Your High School")
            .onAppear(perform: loadHighSchools)
        }
    }
    
    private func loadHighSchools() {
        self.highSchools = DatabaseManager.shared.getTeamsForLeague(id: 9)
    }
    
    private func stars(for rating: Int) -> Int {
        switch rating {
        case 53...:
            return 5
        case 49..<53:
            return 4
        case 44..<49:
            return 3
        case 38..<44:
            return 2
        default:
            return 1
        }
    }
    
    var filteredSchools: [TeamInfo] {
        if searchText.isEmpty {
            return highSchools
        } else {
            return highSchools.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }
}

struct StarRatingView: View {
    let rating: Int
    
    var body: some View {
        HStack {
            ForEach(1...5, id: \.self) { index in
                Image(systemName: index <= rating ? "star.fill" : "star")
                    .foregroundColor(.yellow)
            }
        }
    }
}

struct SearchBar: View {
    @Binding var text: String

    var body: some View {
        HStack {
            TextField("Search", text: $text)
                .padding(7)
                .padding(.horizontal, 25)
                .background(Color(.systemGray6))
                .cornerRadius(8)
                .overlay(
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                            .frame(minWidth: 0, maxWidth: .infinity, alignment: .leading)
                            .padding(.leading, 8)
                        
                        if !text.isEmpty {
                            Button(action: { self.text = "" }) {
                                Image(systemName: "multiply.circle.fill")
                                    .foregroundColor(.gray)
                                    .padding(.trailing, 8)
                            }
                        }
                    }
                )
        }
        .padding(.horizontal, 10)
    }
}
