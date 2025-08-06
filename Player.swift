//
//  Player.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

import Foundation

struct Player: Codable {
    
    // --- Nested Types ---
    enum ActivityType: String, Codable {
        case school = "School"
        case practice = "Team Practice"
        case game = "Game Day"
        case rest = "Rest Day"
        case skillSkating = "Train Skating"
        case skillShooting = "Train Shooting"
        case skillPuckControl = "Train Puck Control"
        case skillDefense = "Train Defense"
    }

    enum Skill: String, CaseIterable, Codable {
        case skating = "Skating"
        case shootingAccuracy = "Shooting Accuracy"
        case shootingPower = "Shooting Power"
        case puckHandling = "Puck Control"
        case passing = "Passing"
        case checking = "Checking"
        case defense = "Defensive Positioning"
        case hockeyIQ = "Hockey IQ"
        case strength = "Strength"
        case conditioning = "Conditioning"
    }

    enum League: String, Codable {
        case highSchool = "High School"
        case juniorA = "Junior A"
        case juniorAAA = "Major Junior"
        case collegeD1 = "NCAA Division I"
        case collegeD3 = "NCAA Division III"
        case proAHL = "AHL"
        case proNHL = "NHL"
        
        var description: String { self.rawValue }
        var displayName: String { self.rawValue }
    }
    
    struct Relationships: Codable {
        var coach: Int = 50
        var teammates: Int = 50
        var management: Int = 50
        var family: Int = 75
    }

    struct Contract: Codable {
        var teamName: String
        var yearsRemaining: Int
        var annualSalary: Double
    }
    
    struct DraftDetails: Codable {
        var year: Int
        var teamName: String
        var round: Int
        var overallPick: Int
    }
    
    // --- Main Player Properties ---
    var firstName: String
    var lastName: String
    var name: String { "\(firstName) \(lastName)" }
    var age: Int
    var teamName: String = "Unassigned"
    var skills: [Skill: Int]
    var relationships = Relationships()
    var currentContract: Contract?
    var draftDetails: DraftDetails?
    var currentLeague: League = .highSchool
    var draftEligibilityYear: Int
    var scoutingReport: String = "Not on draft radar."
    var gamesPlayed: Int = 0
    var goals: Int = 0
    var assists: Int = 0
    var points: Int { goals + assists }
    var bankBalance: Double = 1000.0
    var ownedItemIDs: [String] = []
    var maintainedSkills: [Skill] = []
    
    init(firstName: String, lastName: String) {
        self.firstName = firstName
        self.lastName = lastName
        self.age = 14
        self.draftEligibilityYear = 2027
        
        var initialSkills = [Skill: Int]()
        for skill in Skill.allCases {
            initialSkills[skill] = Int.random(in: 40...55)
        }
        self.skills = initialSkills
    }
    
    enum CodingKeys: String, CodingKey {
        case firstName, lastName, age, teamName, skills, relationships, currentContract, draftDetails, currentLeague, draftEligibilityYear, scoutingReport, gamesPlayed, goals, assists, bankBalance, ownedItemIDs, maintainedSkills
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        firstName = try container.decode(String.self, forKey: .firstName)
        lastName = try container.decode(String.self, forKey: .lastName)
        age = try container.decodeIfPresent(Int.self, forKey: .age) ?? 14
        teamName = try container.decodeIfPresent(String.self, forKey: .teamName) ?? "Unassigned"
        skills = try container.decodeIfPresent([Skill: Int].self, forKey: .skills) ?? [:]
        relationships = try container.decodeIfPresent(Relationships.self, forKey: .relationships) ?? Relationships()
        currentContract = try container.decodeIfPresent(Contract.self, forKey: .currentContract)
        draftDetails = try container.decodeIfPresent(DraftDetails.self, forKey: .draftDetails)
        currentLeague = try container.decodeIfPresent(League.self, forKey: .currentLeague) ?? .highSchool
        draftEligibilityYear = try container.decodeIfPresent(Int.self, forKey: .draftEligibilityYear) ?? 2027
        scoutingReport = try container.decodeIfPresent(String.self, forKey: .scoutingReport) ?? "Not on draft radar."
        gamesPlayed = try container.decodeIfPresent(Int.self, forKey: .gamesPlayed) ?? 0
        goals = try container.decodeIfPresent(Int.self, forKey: .goals) ?? 0
        assists = try container.decodeIfPresent(Int.self, forKey: .assists) ?? 0
        bankBalance = try container.decodeIfPresent(Double.self, forKey: .bankBalance) ?? 1000.0
        ownedItemIDs = try container.decodeIfPresent([String].self, forKey: .ownedItemIDs) ?? []
        maintainedSkills = try container.decodeIfPresent([Skill].self, forKey: .maintainedSkills) ?? []
    }
}

extension Player {
    func getBirthday() -> Date {
        let currentYear = Calendar.current.component(.year, from: Date())
        let birthYear = currentYear - age
        var components = DateComponents()
        components.year = birthYear
        components.month = 8
        components.day = 1
        return Calendar.current.date(from: components) ?? Date()
    }
}
