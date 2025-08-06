//
//  DraftDayView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct DraftDayView: View {
    @EnvironmentObject var gameManager: GameManager

    var body: some View {
        VStack {
            Text("NHL Draft Day!")
                .font(.largeTitle)
            
            // This is just a placeholder; you'll build this out more later
            Button("Offer Entry-Level Contract") {
                gameManager.offerEntryLevelContract()
            }
        }
    }
    
    // This is an example of where your error was.
    // I am assuming a structure for your GameEvent based on other files.
    // If your GameEvent is different, this may need adjustment.
    private func createExampleEvent() -> GameEvent {
        let exampleEvent = GameEvent(
            title: "Example",
            description: "Example",
            options: [
                // CORRECTED: Using 'text' and 'consequence' to match the likely definition
                EventOption(text: "Choice 1", consequence: { gm in
                    print("Chose 1")
                }),
                EventOption(text: "Choice 2", consequence: { gm in
                    print("Chose 2")
                })
            ]
        )
        return exampleEvent
    }
}
