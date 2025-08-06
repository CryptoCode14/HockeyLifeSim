//
//  DatabaseManager.swift
//  HockeyLifeSim
//
//  Created by Westin Kropf on 8/4/25.
//

import Foundation
import SQLite

class DatabaseManager {

    static let shared = DatabaseManager()
    private var db: Connection?

    // League Table Structure
    private let leaguesTable = Table("leagues")
    private let league_id = Expression<Int64>("league_id")
    private let league_name = Expression<String>("league_name")
    private let league_abbr = Expression<String>("league_abbr")
    private let league_level = Expression<Int64>("league_level")
    private let country = Expression<String>("country")
    private let prestige = Expression<Int64>("prestige")

    // Team Table Structure
    private let teamsTable = Table("teams")
    private let team_id = Expression<Int64>("team_id")
    private let team_name = Expression<String>("team_name")
    private let city = Expression<String>("city")
    private let arena_name = Expression<String>("arena_name")
    private let team_league_id = Expression<Int64>("league_id")
    private let overall_rating = Expression<Int64>("overall_rating")
    private let offense_rating = Expression<Int64>("offense_rating")
    private let defense_rating = Expression<Int64>("defense_rating")
    private let goaltending_rating = Expression<Int64>("goaltending_rating")
    private let market_size = Expression<Int64>("market_size")
    private let fan_loyalty = Expression<Int64>("fan_loyalty")


    private init() {
        do {
            let documentDirectory = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            let fileUrl = documentDirectory.appendingPathComponent("hockey_database").appendingPathExtension("sqlite3")
            db = try Connection(fileUrl.path)
            print("🔍 Database connection successful at: \(fileUrl.path)")
            
            let defaults = UserDefaults.standard
            // MODIFIED: Changed the key to v7 to ensure a final clean seed.
            if !defaults.bool(forKey: "isDatabaseSeeded_v7") {
                print("🔍 Database has not been seeded with v7. Seeding now...")
                createAndPopulateTables()
                defaults.set(true, forKey: "isDatabaseSeeded_v7")
                print("🔍 Database seeding complete.")
            } else {
                print("🔍 Database already seeded with v7. Skipping population.")
            }

        } catch {
            print("❌ ERROR connecting to database: \(error)")
        }
    }

    private func createAndPopulateTables() {
        guard let db = db else { return }
        do {
            try db.run(leaguesTable.drop(ifExists: true))
            try db.run(teamsTable.drop(ifExists: true))
            print("🔍 Dropped old tables for a clean seed.")
            
            try db.run(leaguesTable.create { table in
                table.column(league_id, primaryKey: true)
                table.column(league_name)
                table.column(league_abbr)
                table.column(league_level)
                table.column(country)
                table.column(prestige)
            })
            print("🔍 'leagues' table created successfully.")
            
            try db.run(teamsTable.create { table in
                table.column(team_id, primaryKey: true)
                table.column(team_name)
                table.column(city)
                table.column(arena_name)
                table.column(team_league_id) // This is the column we filter on
                table.column(overall_rating)
                table.column(offense_rating)
                table.column(defense_rating)
                table.column(goaltending_rating)
                table.column(market_size)
                table.column(fan_loyalty)
            })
            print("🔍 'teams' table created successfully.")
            
            populateLeagues()
            populateTeams()

        } catch {
            print("❌ ERROR creating tables: \(error)")
        }
    }

    private func populateLeagues() {
        guard let db = db, let path = Bundle.main.path(forResource: "HockeyLeagues", ofType: "csv") else {
            print("❌ ERROR: HockeyLeagues.csv not found in bundle!")
            return
        }
        
        do {
            let csvData = try String(contentsOfFile: path, encoding: .utf8)
            let rows = csvData.components(separatedBy: .newlines).filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
            let leagueRows = Array(rows.dropFirst())
            
            var insertedCount = 0
            for row in leagueRows {
                let columns = row.components(separatedBy: ",")
                if columns.count == 6 {
                    let insert = leaguesTable.insert(
                        league_id <- Int64(columns[0].trimmingCharacters(in: .whitespaces)) ?? 0,
                        league_name <- columns[1].trimmingCharacters(in: .whitespaces),
                        league_abbr <- columns[2].trimmingCharacters(in: .whitespaces),
                        league_level <- Int64(columns[3].trimmingCharacters(in: .whitespaces)) ?? 0,
                        country <- columns[4].trimmingCharacters(in: .whitespaces),
                        prestige <- Int64(columns[5].trimmingCharacters(in: .whitespaces)) ?? 0
                    )
                    try db.run(insert)
                    insertedCount += 1
                }
            }
            print("✅ Inserted \(insertedCount) leagues into the database.")
        } catch {
            print("❌ ERROR populating leagues: \(error)")
        }
    }

    private func populateTeams() {
        guard let db = db, let path = Bundle.main.path(forResource: "Hockeyteams", ofType: "csv") else {
            print("❌ ERROR: Hockeyteams.csv not found in bundle! Please check spelling and case-sensitivity.")
            return
        }
        
        do {
            let csvData = try String(contentsOfFile: path, encoding: .utf8)
            let rows = csvData.components(separatedBy: .newlines).filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
            let teamRows = Array(rows.dropFirst())
            
            var insertedCount = 0
            for row in teamRows {
                let columns = row.components(separatedBy: ",")
                if columns.count == 11 {
                    let insert = teamsTable.insert(
                        team_id <- Int64(columns[0].trimmingCharacters(in: .whitespaces)) ?? 0,
                        team_name <- columns[1].trimmingCharacters(in: .whitespaces),
                        city <- columns[2].trimmingCharacters(in: .whitespaces),
                        arena_name <- columns[3].trimmingCharacters(in: .whitespaces),
                        team_league_id <- Int64(columns[4].trimmingCharacters(in: .whitespaces)) ?? 0,
                        overall_rating <- Int64(columns[5].trimmingCharacters(in: .whitespaces)) ?? 0,
                        offense_rating <- Int64(columns[6].trimmingCharacters(in: .whitespaces)) ?? 0,
                        defense_rating <- Int64(columns[7].trimmingCharacters(in: .whitespaces)) ?? 0,
                        goaltending_rating <- Int64(columns[8].trimmingCharacters(in: .whitespaces)) ?? 0,
                        market_size <- Int64(columns[9].trimmingCharacters(in: .whitespaces)) ?? 0,
                        fan_loyalty <- Int64(columns[10].trimmingCharacters(in: .whitespaces)) ?? 0
                    )
                    try db.run(insert)
                    insertedCount += 1
                }
            }
            print("✅ Inserted \(insertedCount) teams into the database.")
        } catch {
            print("❌ ERROR populating teams: \(error)")
        }
    }
    
    // MODIFIED: This function now has a more robust query.
    func getTeamsForLeague(id: Int64) -> [TeamInfo] {
        var teams: [TeamInfo] = []
        guard let db = db else {
            print("❌ ERROR: Database connection is nil in getTeamsForLeague.")
            return teams
        }
        
        let targetLeagueID = id
        print("🔍 Querying for teams with specific league_id: \(targetLeagueID)")
        
        // This is a more explicit way to write the query which can sometimes help the query planner.
        let query = teamsTable.filter(self.team_league_id == targetLeagueID)
                           .select(self.team_id, self.team_name, self.overall_rating)

        do {
            for team in try db.prepare(query) {
                teams.append(TeamInfo(id: team[self.team_id],
                                  name: team[self.team_name],
                                  rating: Int(team[self.overall_rating])))
            }
            print("🔍 Found \(teams.count) teams for league \(targetLeagueID).")
            if teams.isEmpty {
                print("⚠️ Query returned 0 teams. Check if teams for league ID \(targetLeagueID) exist in Hockeyteams.csv.")
            }
        } catch {
            print("❌ ERROR fetching teams for league \(targetLeagueID): \(error)")
        }
        
        return teams
    }
}
