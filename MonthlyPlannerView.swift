//
//  MonthlyPlannerView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//
//
//  MonthlyPlannerView.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import SwiftUI

struct MonthlyPlannerView: View {
    @EnvironmentObject var gameManager: GameManager
    @Environment(\.dismiss) var dismiss

    private var daysInMonth: [Date] {
        guard let monthInterval = Calendar.current.dateInterval(of: .month, for: gameManager.currentDate) else { return [] }
        var dates: [Date] = []
        var day = monthInterval.start
        while day < monthInterval.end {
            dates.append(day)
            if let nextDay = Calendar.current.date(byAdding: .day, value: 1, to: day) {
                day = nextDay
            } else { break }
        }
        return dates
    }

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 10) {
                    ForEach(daysInMonth, id: \.self) { day in
                        // This line now works because gameManager.monthlySchedule exists
                        CalendarDayView(day: day, activity: gameManager.monthlySchedule[day])
                    }
                }
                .padding()
            }
            .navigationTitle(gameManager.currentDate.formatted(.dateTime.month(.wide).year()))
            .navigationBarItems(trailing: Button("Done") {
                dismiss()
            })
            .onAppear {
                // This line now works because gameManager.generateMonthlySchedule() exists
                gameManager.generateMonthlySchedule()
            }
        }
    }
}

struct CalendarDayView: View {
    let day: Date
    let activity: Player.ActivityType?
    
    private var dayFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "d"
        return formatter
    }

    var body: some View {
        VStack(spacing: 4) {
            Text(dayFormatter.string(from: day))
                .font(.headline)
                .padding(5)
                .background(Circle().fill(Color.secondary))
                .foregroundColor(.white)
            
            Spacer()
            
            switch activity {
            case .school:
                ActivityLabel(text: "School", icon: "book.fill", color: .blue)
            case .practice:
                ActivityLabel(text: "Practice", icon: "figure.hockey", color: .orange)
            case .game:
                ActivityLabel(text: "Game Day", icon: "flag.2.crossed.fill", color: .red)
            case .rest:
                ActivityLabel(text: "Rest", icon: "bed.double.fill", color: .indigo)
            case .none:
                Button(action: {
                    print("Tapped on a free day: \(day)")
                }) {
                    ActivityLabel(text: "Free Day", icon: "plus", color: .green, isButton: true)
                }
            default:
                ActivityLabel(text: activity?.rawValue ?? "", icon: "figure.hockey", color: .gray)
            }
            
            Spacer()
        }
        .frame(height: 100)
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

struct ActivityLabel: View {
    let text: String
    let icon: String
    let color: Color
    var isButton: Bool = false
    
    var body: some View {
        VStack {
            Image(systemName: icon)
            Text(text)
                .font(.caption)
                .fontWeight(isButton ? .bold : .regular)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .padding(5)
        .frame(maxWidth: .infinity)
        .background(color.opacity(0.8))
        .foregroundColor(.white)
        .cornerRadius(5)
        .padding(.horizontal, 4)
    }
}

struct MonthlyPlannerView_Previews: PreviewProvider {
    static var previews: some View {
        MonthlyPlannerView()
            .environmentObject(GameManager())
    }
}
