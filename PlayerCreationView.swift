//
//  PlayerCreationView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

//
//  PlayerCreationView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import SwiftUI

struct PlayerCreationView: View {
    @EnvironmentObject var gameManager: GameManager
    @State private var firstName: String = ""
    @State private var lastName: String = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("Create Your Player")
                .font(.largeTitle)
                .fontWeight(.bold)

            TextField("First Name", text: $firstName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            TextField("Last Name", text: $lastName)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Button(action: {
                gameManager.setupNewPlayer(firstName: firstName, lastName: lastName)
            }) {
                Text("Next: Choose High School")
                    .padding()
                    .background(firstName.isEmpty || lastName.isEmpty ? Color.gray : Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .disabled(firstName.isEmpty || lastName.isEmpty)
            
            Spacer()
        }
        .padding()
    }
}
