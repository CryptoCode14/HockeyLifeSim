//
//  ShootingView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import SwiftUI

struct ShootingView: View {
    let onComplete: (Bool) -> Void
    let playerAccuracy: Int
    let playerPower: Int
    
    @State private var targetPosition: CGPoint = .zero
    @State private var puckPosition: CGPoint = .zero
    @State private var showResult = false
    @State private var didScore = false
    
    // NEW: Added an explicit initializer to make it accessible.
    init(onComplete: @escaping (Bool) -> Void, playerAccuracy: Int, playerPower: Int) {
        self.onComplete = onComplete
        self.playerAccuracy = playerAccuracy
        self.playerPower = playerPower
    }
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background Rink Image
                Image("hockey_rink_top_down") // Assuming you have an image with this name
                    .resizable()
                    .scaledToFill()
                    .edgesIgnoringSafeArea(.all)
                
                // Net
                Rectangle()
                    .fill(Color.gray)
                    .frame(width: 80, height: 40)
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.2)
                
                // Target
                Circle()
                    .stroke(Color.red, lineWidth: 2)
                    .frame(width: 30, height: 30)
                    .position(targetPosition)
                
                // Puck
                Circle()
                    .fill(Color.black)
                    .frame(width: 20, height: 20)
                    .position(puckPosition)
                    .gesture(
                        DragGesture().onEnded { value in
                            shootPuck(towards: value.location)
                        }
                    )
                
                if showResult {
                    VStack {
                        Text(didScore ? "GOAL!" : "SAVED!")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(didScore ? .green : .red)
                        Button("Continue") {
                            onComplete(didScore)
                        }
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                    .padding()
                    .background(Color.black.opacity(0.75))
                    .cornerRadius(20)
                }
            }
            .onAppear {
                let midX = geometry.size.width / 2
                puckPosition = CGPoint(x: midX, y: geometry.size.height * 0.8)
                moveTarget(in: geometry.size)
            }
        }
    }
    
    func moveTarget(in size: CGSize) {
        // Net position is fixed, let's assume its top-left is at (size.width/2 - 40, size.height*0.2 - 20)
        let netXRange = (size.width/2 - 35)...(size.width/2 + 35)
        let netYRange = (size.height*0.2 - 15)...(size.height*0.2 + 15)
        
        targetPosition = CGPoint(
            x: CGFloat.random(in: netXRange),
            y: CGFloat.random(in: netYRange)
        )
    }
    
    func shootPuck(towards location: CGPoint) {
        let distance = sqrt(pow(location.x - targetPosition.x, 2) + pow(location.y - targetPosition.y, 2))
        
        // Higher accuracy means a larger "success" radius
        let successRadius = 50 - (playerAccuracy / 3)
        
        if distance < CGFloat(successRadius) {
            // It's an accurate shot, now check power vs goalie
            let scoreChance = Double(playerPower) / 100.0
            didScore = Double.random(in: 0...1) < scoreChance
        } else {
            didScore = false // Missed the net
        }
        
        withAnimation {
            showResult = true
        }
    }
}
