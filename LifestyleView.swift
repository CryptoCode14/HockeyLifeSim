//
//  LifestyleView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import SwiftUI

struct LifestyleView: View {
    let player: Player
    let items: [LifestyleItem]
    let onPurchase: (LifestyleItem) -> Void
    
    // NEW: Added an explicit initializer to make it accessible from other views.
    init(player: Player, items: [LifestyleItem], onPurchase: @escaping (LifestyleItem) -> Void) {
        self.player = player
        self.items = items
        self.onPurchase = onPurchase
    }
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Owned Items")) {
                    if player.ownedItemIDs.isEmpty {
                        Text("No items owned yet.")
                    } else {
                        ForEach(items.filter { player.ownedItemIDs.contains($0.id) }) { item in
                            HStack {
                                Text(item.name)
                                Spacer()
                                Text(item.bonus.description).font(.caption).foregroundColor(.secondary)
                            }
                        }
                    }
                }
                
                Section(header: Text("Store")) {
                    ForEach(items) { item in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(item.name)
                                Text(item.bonus.description).font(.caption).foregroundColor(.secondary)
                            }
                            Spacer()
                            Button(action: {
                                onPurchase(item)
                            }) {
                                Text("$\(Int(item.cost))")
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(player.ownedItemIDs.contains(item.id) || player.bankBalance < item.cost ? Color.gray : Color.blue)
                                    .foregroundColor(.white)
                                    .cornerRadius(8)
                            }
                            .disabled(player.ownedItemIDs.contains(item.id) || player.bankBalance < item.cost)
                        }
                    }
                }
            }
            .navigationTitle("Lifestyle & Gear")
        }
    }
}
