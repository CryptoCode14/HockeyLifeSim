//
//  GameEvent.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import Foundation
import SwiftUI

// NEW: Definition for the choices within an event.
struct EventOption {
    let text: String
    let consequence: (GameManager) -> Void
}

// MODIFIED: Conforms to Identifiable and now has an 'id' property.
struct GameEvent: Identifiable {
    let id = UUID() // This makes it identifiable for SwiftUI sheets.
    let title: String
    let description: String
    let options: [EventOption]
}
