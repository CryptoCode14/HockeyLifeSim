//
//  Extensions.swift
//  HockeyLifeSim
//
//  Created by Brian Google on 8/6/25.
//

import SwiftUI

// By creating an extension on Int, we can call this function on any integer
// variable (e.g., myNumber.ordinalSuffix()), which is clean and reusable.
extension Int {
    func ordinalSuffix() -> String {
        let ones = self % 10
        let tens = (self / 10) % 10
        if tens == 1 {
            return "th"
        }
        switch ones {
        case 1: return "st"
        case 2: return "nd"
        case 3: return "rd"
        default: return "th"
        }
    }
}

// NEW: This is the robust, modern way to handle orientation locking.
struct OrientationLockModifier: ViewModifier {
    let orientation: UIInterfaceOrientationMask
    
    func body(content: Content) -> some View {
        content
            .onAppear {
                // When the view appears, tell the AppDelegate to lock orientation.
                AppDelegate.orientationLock = orientation
            }
            .onDisappear {
                // When the view disappears, release the lock.
                AppDelegate.orientationLock = .all
            }
    }
}

extension View {
    func lockOrientation(to orientation: UIInterfaceOrientationMask) -> some View {
        self.modifier(OrientationLockModifier(orientation: orientation))
    }
}
