//
//  EventView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//


import SwiftUI

struct EventView: View {
    // MODIFIED: Renamed from 'gameEvent' to 'event' to match its usage below.
    let event: GameEvent
    let onComplete: (EventOption) -> Void

    var body: some View {
        VStack(spacing: 20) {
            Text(event.title)
                .font(.largeTitle)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)

            Text(event.description)
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)

            ForEach(event.options, id: \.text) { option in
                Button(action: {
                    onComplete(option)
                }) {
                    Text(option.text)
                        .fontWeight(.bold)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
        }
        .padding(30)
    }
}

struct EventView_Previews: PreviewProvider {
    static var previews: some View {
        // Create a sample event for the preview to work
        let sampleEvent = GameEvent(
            title: "Sample Event",
            description: "This is a sample event description. Make a choice.",
            options: [
                EventOption(text: "Choice A", consequence: { _ in }),
                EventOption(text: "Choice B", consequence: { _ in })
            ]
        )
        
        // MODIFIED: Added the 'onComplete' closure to the initializer to fix the error.
        EventView(event: sampleEvent, onComplete: { _ in
            print("Preview choice selected.")
        })
    }
}
