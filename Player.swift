//
//  Player.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

//
//  Player.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/3/25.
//

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
        case school = "School", practice = "Team Practice", game = "Game Day", rest = "Rest Day"
        case skillSkating = "Train Skating", skillShooting = "Train Shooting", skillPuckControl = "Train Puck Control", skillDefense = "Train Defense"
    }

    enum Skill: String, CaseIterable, Codable {
        case skating = "Skating", shootingAccuracy = "Shooting Accuracy", shootingPower = "Shooting Power", puckHandling = "Puck Control"
        case passing = "Passing", checking = "Checking", defense = "Defensive Positioning", hockeyIQ = "Hockey IQ"
        case strength = "Strength", conditioning = "Conditioning"
    }

    enum League: String, Codable {
        case highSchool = "High School", juniorA = "Junior A", juniorAAA = "Major Junior", collegeD1 = "NCAA Division I"
        case collegeD3 = "NCAA Division III", proAHL = "AHL", proNHL = "NHL"
        var description: String { self.rawValue }
        var displayName: String { self.rawValue }
    }
    
    struct Relationships: Codable {
        var coach: Int = 50, teammates: Int = 50, management: Int = 50, family: Int = 75
    }

    struct Contract: Codable {
        var teamName: String, yearsRemaining: Int, annualSalary: Double
    }
    
    struct DraftDetails: Codable {
        var year: Int, teamName: String, round: Int, overallPick: Int
    }
    
    // --- Main Player Properties ---
    var firstName: String, lastName: String
    var name: String { "\(firstName) \(lastName)" }
    var age: Int
    var teamName: String = "Unassigned"
    var teamId: Int = 0
    var skills: [Skill: Int]
    var relationships = Relationships()
    var currentContract: Contract?
    var draftDetails: DraftDetails?
    var currentLeague: League = .highSchool
    var draftEligibilityYear: Int
    var scoutingReport: String = "Not on draft radar."
    
    // --- Career Stats ---
    var gamesPlayed: Int = 0, goals: Int = 0, assists: Int = 0
    var points: Int { goals + assists }
    var pim: Int = 0
    var plusMinus: Int = 0
    
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
    
    // --- Codable Conformance ---
    enum CodingKeys: String, CodingKey {
        case firstName, lastName, age, teamName, teamId, skills, relationships, currentContract, draftDetails, currentLeague, draftEligibilityYear, scoutingReport, gamesPlayed, goals, assists, pim, plusMinus, bankBalance, ownedItemIDs, maintainedSkills
    }

    // This custom initializer handles loading data from older save files that might be missing new properties.
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        firstName = try container.decode(String.self, forKey: .firstName)
        lastName = try container.decode(String.self, forKey: .lastName)
        age = try container.decodeIfPresent(Int.self, forKey: .age) ?? 14
        teamName = try container.decodeIfPresent(String.self, forKey: .teamName) ?? "Unassigned"
        teamId = try container.decodeIfPresent(Int.self, forKey: .teamId) ?? 0
        skills = try container.decodeIfPresent([Skill: Int].self, forKey: .skills) ?? [:]
        relationships = try container.decodeIfPresent(Relationships.self, forKey: .relationships) ?? Relationships()
        currentContract = try container.decodeIfPresent(Player.Contract.self, forKey: .currentContract)
        draftDetails = try container.decodeIfPresent(Player.DraftDetails.self, forKey: .draftDetails)
        currentLeague = try container.decodeIfPresent(Player.League.self, forKey: .currentLeague) ?? .highSchool
        draftEligibilityYear = try container.decodeIfPresent(Int.self, forKey: .draftEligibilityYear) ?? 2027
        scoutingReport = try container.decodeIfPresent(String.self, forKey: .scoutingReport) ?? "Not on draft radar."
        gamesPlayed = try container.decodeIfPresent(Int.self, forKey: .gamesPlayed) ?? 0
        goals = try container.decodeIfPresent(Int.self, forKey: .goals) ?? 0
        assists = try container.decodeIfPresent(Int.self, forKey: .assists) ?? 0
        pim = try container.decodeIfPresent(Int.self, forKey: .pim) ?? 0
        plusMinus = try container.decodeIfPresent(Int.self, forKey: .plusMinus) ?? 0
        bankBalance = try container.decodeIfPresent(Double.self, forKey: .bankBalance) ?? 1000.0
        ownedItemIDs = try container.decodeIfPresent([String].self, forKey: .ownedItemIDs) ?? []
        maintainedSkills = try container.decodeIfPresent([Skill].self, forKey: .maintainedSkills) ?? []
    }
}

// RESTORED: The missing 'getBirthday' function.
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
