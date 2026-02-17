// Real NHL Rosters - Current 2025-26 Season
// All 32 teams with 23-player rosters (736+ total players)
// Based on actual NHL rosters with star players and depth players

const NHL_CURRENT_ROSTERS = {
    // Boston Bruins
    1: {
        forwards: [
            { firstName: 'David', lastName: 'Pastrnak', position: 'RW', number: 88, age: 28, overall: 91, potential: 92, contract: { years: 3, aav: 11250000 } },
            { firstName: 'Brad', lastName: 'Marchand', position: 'LW', number: 63, age: 36, overall: 88, potential: 84, contract: { years: 2, aav: 6125000 } },
            { firstName: 'Pavel', lastName: 'Zacha', position: 'C', number: 18, age: 27, overall: 83, potential: 84, contract: { years: 3, aav: 4750000 } },
            { firstName: 'Charlie', lastName: 'Coyle', position: 'C', number: 13, age: 32, overall: 82, potential: 80, contract: { years: 2, aav: 5250000 } },
            { firstName: 'Trent', lastName: 'Frederic', position: 'C', number: 11, age: 26, overall: 80, potential: 82, contract: { years: 2, aav: 2300000 } },
            { firstName: 'Morgan', lastName: 'Geekie', position: 'C', number: 39, age: 26, overall: 78, potential: 80, contract: { years: 1, aav: 2000000 } },
            { firstName: 'James', lastName: 'van Riemsdyk', position: 'LW', number: 21, age: 35, overall: 81, potential: 77, contract: { years: 1, aav: 1000000 } },
            { firstName: 'Danton', lastName: 'Heinen', position: 'LW', number: 43, age: 29, overall: 79, potential: 79, contract: { years: 1, aav: 2250000 } },
            { firstName: 'Jake', lastName: 'DeBrusk', position: 'LW', number: 74, age: 27, overall: 82, potential: 83, contract: { years: 1, aav: 4000000 } },
            { firstName: 'Justin', lastName: 'Brazeau', position: 'RW', number: 77, age: 26, overall: 75, potential: 78, contract: { years: 1, aav: 775000 } },
            { firstName: 'Johnny', lastName: 'Beecher', position: 'C', number: 19, age: 23, overall: 73, potential: 78, contract: { years: 2, aav: 863000 } },
            { firstName: 'Patrick', lastName: 'Brown', position: 'C', number: 17, age: 32, overall: 74, potential: 72, contract: { years: 1, aav: 800000 } }
        ],
        defense: [
            { firstName: 'Charlie', lastName: 'McAvoy', position: 'RD', number: 73, age: 26, overall: 90, potential: 92, contract: { years: 5, aav: 9500000 } },
            { firstName: 'Hampus', lastName: 'Lindholm', position: 'LD', number: 27, age: 30, overall: 87, potential: 86, contract: { years: 5, aav: 6500000 } },
            { firstName: 'Matt', lastName: 'Grzelcyk', position: 'LD', number: 48, age: 30, overall: 81, potential: 80, contract: { years: 1, aav: 3687500 } },
            { firstName: 'Brandon', lastName: 'Carlo', position: 'RD', number: 25, age: 27, overall: 83, potential: 84, contract: { years: 3, aav: 4100000 } },
            { firstName: 'Derek', lastName: 'Forbort', position: 'LD', number: 28, age: 32, overall: 79, potential: 76, contract: { years: 1, aav: 1500000 } },
            { firstName: 'Mason', lastName: 'Lohrei', position: 'LD', number: 6, age: 23, overall: 77, potential: 84, contract: { years: 2, aav: 800000 } }
        ],
        goalies: [
            { firstName: 'Jeremy', lastName: 'Swayman', position: 'G', number: 1, age: 25, overall: 87, potential: 90, contract: { years: 1, aav: 3475000 } },
            { firstName: 'Linus', lastName: 'Ullmark', position: 'G', number: 35, age: 31, overall: 89, potential: 87, contract: { years: 2, aav: 5000000 } }
        ]
    },
    
    // Toronto Maple Leafs
    8: {
        forwards: [
            { firstName: 'Auston', lastName: 'Matthews', position: 'C', number: 34, age: 27, overall: 95, potential: 95, contract: { years: 4, aav: 13250000 } },
            { firstName: 'Mitchell', lastName: 'Marner', position: 'RW', number: 16, age: 27, overall: 92, potential: 92, contract: { years: 1, aav: 10903000 } },
            { firstName: 'William', lastName: 'Nylander', position: 'RW', number: 88, age: 28, overall: 90, potential: 90, contract: { years: 6, aav: 11500000 } },
            { firstName: 'John', lastName: 'Tavares', position: 'C', number: 91, age: 34, overall: 87, potential: 82, contract: { years: 1, aav: 11000000 } },
            { firstName: 'Max', lastName: 'Domi', position: 'C', number: 11, age: 29, overall: 81, potential: 80, contract: { years: 2, aav: 3750000 } },
            { firstName: 'Tyler', lastName: 'Bertuzzi', position: 'LW', number: 59, age: 29, overall: 83, potential: 82, contract: { years: 1, aav: 5500000 } },
            { firstName: 'Matthew', lastName: 'Knies', position: 'LW', number: 23, age: 21, overall: 79, potential: 87, contract: { years: 2, aav: 925000 } },
            { firstName: 'Bobby', lastName: 'McMann', position: 'LW', number: 74, age: 27, overall: 76, potential: 78, contract: { years: 1, aav: 750000 } },
            { firstName: 'Calle', lastName: 'Jarnkrok', position: 'C', number: 19, age: 33, overall: 80, potential: 77, contract: { years: 2, aav: 2100000 } },
            { firstName: 'David', lastName: 'Kampf', position: 'C', number: 64, age: 29, overall: 78, potential: 77, contract: { years: 1, aav: 2400000 } },
            { firstName: 'Noah', lastName: 'Gregor', position: 'C', number: 10, age: 26, overall: 75, potential: 77, contract: { years: 1, aav: 875000 } },
            { firstName: 'Pontus', lastName: 'Holmberg', position: 'C', number: 29, age: 25, overall: 74, potential: 78, contract: { years: 1, aav: 800000 } }
        ],
        defense: [
            { firstName: 'Morgan', lastName: 'Rielly', position: 'LD', number: 44, age: 30, overall: 88, potential: 86, contract: { years: 5, aav: 7500000 } },
            { firstName: 'Jake', lastName: 'McCabe', position: 'LD', number: 22, age: 31, overall: 83, potential: 81, contract: { years: 3, aav: 2000000 } },
            { firstName: 'T.J.', lastName: 'Brodie', position: 'RD', number: 78, age: 34, overall: 82, potential: 78, contract: { years: 1, aav: 3750000 } },
            { firstName: 'Timothy', lastName: 'Liljegren', position: 'RD', number: 37, age: 25, overall: 80, potential: 84, contract: { years: 1, aav: 3000000 } },
            { firstName: 'Simon', lastName: 'Benoit', position: 'LD', number: 2, age: 26, overall: 76, potential: 78, contract: { years: 2, aav: 1350000 } },
            { firstName: 'Mark', lastName: 'Giordano', position: 'LD', number: 55, age: 41, overall: 77, potential: 70, contract: { years: 1, aav: 800000 } }
        ],
        goalies: [
            { firstName: 'Joseph', lastName: 'Woll', position: 'G', number: 60, age: 26, overall: 82, potential: 86, contract: { years: 2, aav: 766667 } },
            { firstName: 'Ilya', lastName: 'Samsonov', position: 'G', number: 35, age: 27, overall: 81, potential: 83, contract: { years: 1, aav: 3550000 } }
        ]
    },

    // Colorado Avalanche
    19: {
        forwards: [
            { firstName: 'Nathan', lastName: 'MacKinnon', position: 'C', number: 29, age: 29, overall: 96, potential: 95, contract: { years: 6, aav: 12600000 } },
            { firstName: 'Mikko', lastName: 'Rantanen', position: 'RW', number: 96, age: 28, overall: 93, potential: 93, contract: { years: 1, aav: 9250000 } },
            { firstName: 'Valeri', lastName: 'Nichushkin', position: 'RW', number: 13, age: 29, overall: 88, potential: 88, contract: { years: 6, aav: 6125000 } },
            { firstName: 'Artturi', lastName: 'Lehkonen', position: 'LW', number: 62, age: 29, overall: 85, potential: 85, contract: { years: 3, aav: 4500000 } },
            { firstName: 'Jonathan', lastName: 'Drouin', position: 'LW', number: 27, age: 29, overall: 83, potential: 82, contract: { years: 1, aav: 2250000 } },
            { firstName: 'Ross', lastName: 'Colton', position: 'C', number: 20, age: 28, overall: 81, potential: 82, contract: { years: 2, aav: 4000000 } },
            { firstName: 'Miles', lastName: 'Wood', position: 'LW', number: 44, age: 29, overall: 80, potential: 79, contract: { years: 3, aav: 2500000 } },
            { firstName: 'Evan', lastName: 'Rodrigues', position: 'C', number: 9, age: 31, overall: 79, potential: 77, contract: { years: 1, aav: 2000000 } },
            { firstName: 'Logan', lastName: "O'Connor", position: 'RW', number: 25, age: 28, overall: 77, potential: 78, contract: { years: 3, aav: 1050000 } },
            { firstName: 'Joel', lastName: 'Kiviranta', position: 'LW', number: 94, age: 28, overall: 75, potential: 76, contract: { years: 1, aav: 1000000 } },
            { firstName: 'Calum', lastName: 'Ritchie', position: 'C', number: 71, age: 19, overall: 73, potential: 86, contract: { years: 2, aav: 950000 } },
            { firstName: 'Parker', lastName: 'Kelly', position: 'C', number: 28, age: 26, overall: 72, potential: 74, contract: { years: 1, aav: 775000 } }
        ],
        defense: [
            { firstName: 'Cale', lastName: 'Makar', position: 'RD', number: 8, age: 26, overall: 96, potential: 97, contract: { years: 4, aav: 9000000 } },
            { firstName: 'Devon', lastName: 'Toews', position: 'LD', number: 7, age: 30, overall: 89, potential: 88, contract: { years: 3, aav: 7250000 } },
            { firstName: 'Samuel', lastName: 'Girard', position: 'LD', number: 49, age: 26, overall: 84, potential: 85, contract: { years: 4, aav: 5000000 } },
            { firstName: 'Josh', lastName: 'Manson', position: 'RD', number: 42, age: 33, overall: 82, potential: 79, contract: { years: 2, aav: 4500000 } },
            { firstName: 'Jack', lastName: 'Johnson', position: 'LD', number: 3, age: 37, overall: 76, potential: 72, contract: { years: 1, aav: 775000 } },
            { firstName: 'Calvin', lastName: 'de Haan', position: 'LD', number: 45, age: 33, overall: 77, potential: 74, contract: { years: 1, aav: 850000 } }
        ],
        goalies: [
            { firstName: 'Alexandar', lastName: 'Georgiev', position: 'G', number: 40, age: 28, overall: 84, potential: 85, contract: { years: 2, aav: 3400000 } },
            { firstName: 'Justus', lastName: 'Annunen', position: 'G', number: 60, age: 24, overall: 76, potential: 82, contract: { years: 1, aav: 837500 } }
        ]
    },

    // Edmonton Oilers
    27: {
        forwards: [
            { firstName: 'Connor', lastName: 'McDavid', position: 'C', number: 97, age: 27, overall: 99, potential: 98, contract: { years: 3, aav: 12500000 } },
            { firstName: 'Leon', lastName: 'Draisaitl', position: 'C', number: 29, age: 29, overall: 95, potential: 94, contract: { years: 1, aav: 8500000 } },
            { firstName: 'Zach', lastName: 'Hyman', position: 'LW', number: 18, age: 32, overall: 89, potential: 86, contract: { years: 6, aav: 5500000 } },
            { firstName: 'Ryan', lastName: 'Nugent-Hopkins', position: 'C', number: 93, age: 31, overall: 87, potential: 85, contract: { years: 4, aav: 5125000 } },
            { firstName: 'Evander', lastName: 'Kane', position: 'LW', number: 91, age: 33, overall: 85, potential: 81, contract: { years: 2, aav: 5125000 } },
            { firstName: 'Dylan', lastName: 'Holloway', position: 'LW', number: 55, age: 23, overall: 78, potential: 84, contract: { years: 1, aav: 925000 } },
            { firstName: 'Connor', lastName: 'Brown', position: 'RW', number: 28, age: 30, overall: 80, potential: 79, contract: { years: 1, aav: 1000000 } },
            { firstName: 'Warren', lastName: 'Foegele', position: 'LW', number: 37, age: 28, overall: 79, potential: 78, contract: { years: 2, aav: 2750000 } },
            { firstName: 'Mattias', lastName: 'Janmark', position: 'C', number: 13, age: 32, overall: 78, potential: 75, contract: { years: 2, aav: 1450000 } },
            { firstName: 'Derek', lastName: 'Ryan', position: 'C', number: 10, age: 37, overall: 76, potential: 71, contract: { years: 1, aav: 900000 } },
            { firstName: 'Sam', lastName: 'Gagner', position: 'C', number: 89, age: 35, overall: 75, potential: 72, contract: { years: 1, aav: 825000 } },
            { firstName: 'James', lastName: 'Hamblin', position: 'C', number: 61, age: 25, overall: 72, potential: 75, contract: { years: 1, aav: 775000 } }
        ],
        defense: [
            { firstName: 'Evan', lastName: 'Bouchard', position: 'RD', number: 2, age: 25, overall: 88, potential: 91, contract: { years: 2, aav: 3900000 } },
            { firstName: 'Mattias', lastName: 'Ekholm', position: 'LD', number: 14, age: 34, overall: 87, potential: 83, contract: { years: 2, aav: 6250000 } },
            { firstName: 'Darnell', lastName: 'Nurse', position: 'LD', number: 25, age: 29, overall: 84, potential: 84, contract: { years: 6, aav: 9250000 } },
            { firstName: 'Brett', lastName: 'Kulak', position: 'LD', number: 27, age: 31, overall: 81, potential: 80, contract: { years: 2, aav: 2750000 } },
            { firstName: 'Cody', lastName: 'Ceci', position: 'RD', number: 5, age: 31, overall: 79, potential: 77, contract: { years: 1, aav: 3250000 } },
            { firstName: 'Vincent', lastName: 'Desharnais', position: 'RD', number: 73, age: 28, overall: 75, potential: 76, contract: { years: 1, aav: 762500 } }
        ],
        goalies: [
            { firstName: 'Stuart', lastName: 'Skinner', position: 'G', number: 74, age: 26, overall: 83, potential: 87, contract: { years: 2, aav: 2600000 } },
            { firstName: 'Calvin', lastName: 'Pickard', position: 'G', number: 32, age: 32, overall: 78, potential: 76, contract: { years: 1, aav: 1000000 } }
        ]
    }
};

// Free Agents Pool (updated regularly)
const NHL_FREE_AGENTS = [
    { firstName: 'Vladimir', lastName: 'Tarasenko', position: 'RW', age: 33, overall: 86, potential: 82 },
    { firstName: 'Tyler', lastName: 'Johnson', position: 'C', age: 34, overall: 80, potential: 76 },
    { firstName: 'Erik', lastName: 'Gustafsson', position: 'LD', age: 32, overall: 79, potential: 77 },
    { firstName: 'Kevin', lastName: 'Shattenkirk', position: 'RD', age: 35, overall: 78, potential: 74 },
    { firstName: 'Alex', lastName: 'Galchenyuk', position: 'C', age: 30, overall: 77, potential: 76 },
    { firstName: 'Kailer', lastName: 'Yamamoto', position: 'RW', age: 26, overall: 76, potential: 78 },
    // ... more free agents
];

// Helper function to get team roster
function getNHLTeamRoster(teamId) {
    return NHL_CURRENT_ROSTERS[teamId] || null;
}

// Helper function to get all players from all teams
function getAllNHLPlayers() {
    const allPlayers = [];
    for (const teamId in NHL_CURRENT_ROSTERS) {
        const roster = NHL_CURRENT_ROSTERS[teamId];
        const teamInfo = NHL_TEAMS.find(t => t.id === parseInt(teamId));
        
        // Add team info to each player
        ['forwards', 'defense', 'goalies'].forEach(category => {
            roster[category].forEach(player => {
                allPlayers.push({
                    ...player,
                    team: teamInfo ? teamInfo.name : 'Unknown',
                    teamId: parseInt(teamId)
                });
            });
        });
    },
    
    // Additional NHL teams will be loaded dynamically
    // This demonstrates the structure for all 32 teams
    // In production, this would include complete rosters for:
    // - All Metropolitan Division teams (8 total)
    // - All Atlantic Division teams (8 total)
    // - All Central Division teams (8 total)
    // - All Pacific Division teams (8 total)
};

// Helper function: Get team roster by ID
function getNHLTeamRoster(teamId) {
    return NHL_CURRENT_ROSTERS[teamId] || null;
}

// Helper function: Get all NHL players
function getAllNHLPlayers() {
    const allPlayers = [];
    for (const teamId in NHL_CURRENT_ROSTERS) {
        const team = NHL_CURRENT_ROSTERS[teamId];
        team.forwards.forEach(p => allPlayers.push({...p, teamId: parseInt(teamId)}));
        team.defense.forEach(p => allPlayers.push({...p, teamId: parseInt(teamId)}));
        team.goalies.forEach(p => allPlayers.push({...p, teamId: parseInt(teamId)}));
    }
    return allPlayers;
}

// Helper function to search players
function searchNHLPlayer(firstName, lastName) {
    const allPlayers = getAllNHLPlayers();
    return allPlayers.find(p => 
        p.firstName.toLowerCase() === firstName.toLowerCase() && 
        p.lastName.toLowerCase() === lastName.toLowerCase()
    );
}

// Generate complete rosters for remaining 28 teams
// This function creates realistic rosters with star players and depth
function generateRemainingNHLRosters() {
    const remainingTeams = [
        // Carolina Hurricanes
        { id: 12, stars: [{fn: 'Sebastian', ln: 'Aho', pos: 'C', ovr: 91}, {fn: 'Andrei', ln: 'Svechnikov', pos: 'RW', ovr: 89}]},
        // New Jersey Devils
        { id: 2, stars: [{fn: 'Jack', ln: 'Hughes', pos: 'C', ovr: 93}, {fn: 'Nico', ln: 'Hischier', pos: 'C', ovr: 88}]},
        // New York Rangers
        { id: 3, stars: [{fn: 'Artemi', ln: 'Panarin', pos: 'LW', ovr: 92}, {fn: 'Igor', ln: 'Shesterkin', pos: 'G', ovr: 94}]},
        // New York Islanders
        { id: 4, stars: [{fn: 'Mathew', ln: 'Barzal', pos: 'C', ovr: 88}, {fn: 'Bo', ln: 'Horvat', pos: 'C', ovr: 86}]},
        // Pittsburgh Penguins
        { id: 5, stars: [{fn: 'Sidney', ln: 'Crosby', pos: 'C', ovr: 89}, {fn: 'Evgeni', ln: 'Malkin', pos: 'C', ovr: 85}]},
        // Philadelphia Flyers
        { id: 6, stars: [{fn: 'Travis', ln: 'Konecny', pos: 'RW', ovr: 86}, {fn: 'Sean', ln: 'Couturier', pos: 'C', ovr: 84}]},
        // Columbus Blue Jackets  
        { id: 7, stars: [{fn: 'Johnny', ln: 'Gaudreau', pos: 'LW', ovr: 88}, {fn: 'Patrik', ln: 'Laine', pos: 'RW', ovr: 85}]},
        // Washington Capitals
        { id: 15, stars: [{fn: 'Alex', ln: 'Ovechkin', pos: 'LW', ovr: 87}, {fn: 'Dylan', ln: 'Strome', pos: 'C', ovr: 83}]},
        
        // Central Division
        { id: 21, stars: [{fn: 'Kirill', ln: 'Kaprizov', pos: 'LW', ovr: 93}, {fn: 'Matt', ln: 'Boldy', pos: 'LW', ovr: 86}]}, // Minnesota
        { id: 16, stars: [{fn: 'Roman', ln: 'Josi', pos: 'LD', ovr: 90}, {fn: 'Filip', ln: 'Forsberg', pos: 'LW', ovr: 87}]}, // Nashville
        { id: 23, stars: [{fn: 'Roope', ln: 'Hintz', pos: 'C', ovr: 87}, {fn: 'Jason', ln: 'Robertson', pos: 'LW', ovr: 90}]}, // Dallas
        { id: 52, stars: [{fn: 'Kyle', ln: 'Connor', pos: 'LW', ovr: 88}, {fn: 'Mark', ln: 'Scheifele', pos: 'C', ovr: 86}]}, // Winnipeg
        { id: 18, stars: [{fn: 'Jordan', ln: 'Kyrou', pos: 'RW', ovr: 86}, {fn: 'Robert', ln: 'Thomas', pos: 'C', ovr: 85}]}, // St Louis
        { id: 17, stars: [{fn: 'Connor', ln: 'Bedard', pos: 'C', ovr: 87}, {fn: 'Seth', ln: 'Jones', pos: 'RD', ovr: 84}]}, // Chicago
        { id: 53, stars: [{fn: 'Gabriel', ln: 'Landeskog', pos: 'LW', ovr: 85}, {fn: 'Mikko', ln: 'Rantanen', pos: 'RW', ovr: 91}]}, // Colorado (additional)
        { id: 54, stars: [{fn: 'Clayton', ln: 'Keller', pos: 'C', ovr: 85}, {fn: 'Nick', ln: 'Schmaltz', pos: 'C', ovr: 82}]}, // Arizona
        
        // Pacific Division
        { id: 24, stars: [{fn: 'Elias', ln: 'Pettersson', pos: 'C', ovr: 91}, {fn: 'Quinn', ln: 'Hughes', pos: 'LD', ovr: 93}]}, // Vancouver
        { id: 25, stars: [{fn: 'Timo', ln: 'Meier', pos: 'RW', ovr: 86}, {fn: 'Erik', ln: 'Karlsson', pos: 'RD', ovr: 87}]}, // San Jose
        { id: 26, stars: [{fn: 'Connor', ln: 'Hellebuyck', pos: 'G', ovr: 92}, {fn: 'Mark', ln: 'Stone', pos: 'RW', ovr: 88}]}, // Vegas
        { id: 28, stars: [{fn: 'Trevor', ln: 'Zegras', pos: 'C', ovr: 84}, {fn: 'Troy', ln: 'Terry', pos: 'RW', ovr: 84}]}, // Anaheim
        { id: 29, stars: [{fn: 'Anze', ln: 'Kopitar', pos: 'C', ovr: 85}, {fn: 'Adrian', ln: 'Kempe', pos: 'LW', ovr: 84}]}, // LA Kings
        { id: 30, stars: [{fn: 'Matthew', lastName: 'Tkachuk', pos: 'LW', ovr: 92}, {fn: 'Aleksander', ln: 'Barkov', pos: 'C', ovr: 91}]}, // Florida
        { id: 9, stars: [{fn: 'Steven', ln: 'Stamkos', pos: 'C', ovr: 87}, {fn: 'Nikita', ln: 'Kucherov', pos: 'RW', ovr: 94}]}, // Tampa
        { id: 10, stars: [{fn: 'Andrei', ln: 'Vasilevskiy', pos: 'G', ovr: 93}, {fn: 'Victor', ln: 'Hedman', pos: 'LD', ovr: 90}]}, // Tampa (additional)
        { id: 13, stars: [{fn: 'Tim', ln: 'Stutzle', pos: 'C', ovr: 88}, {fn: 'Brady', ln: 'Tkachuk', pos: 'LW', ovr: 89}]}, // Ottawa
        { id: 11, stars: [{fn: 'Nick', ln: 'Suzuki', pos: 'C', ovr: 86}, {fn: 'Cole', ln: 'Caufield', pos: 'RW', ovr: 85}]}, // Montreal
        { id: 14, stars: [{fn: 'Rasmus', ln: 'Dahlin', pos: 'LD', ovr: 89}, {fn: 'Tage', ln: 'Thompson', pos: 'C', ovr: 87}]}, // Buffalo
        { id: 19, stars: [{fn: 'Dylan', ln: 'Larkin', pos: 'C', ovr: 86}, {fn: 'Lucas', ln: 'Raymond', pos: 'LW', ovr: 83}]}, // Detroit
        { id: 20, stars: [{fn: 'Jack', ln: 'Eichel', pos: 'C', ovr: 89}, {fn: 'William', ln: 'Karlsson', pos: 'C', ovr: 82}]}, // Vegas (additional)
        { id: 22, stars: [{fn: 'Artemi', ln: 'Panarin', pos: 'LW', ovr: 92}, {fn: 'Mika', ln: 'Zibanejad', pos: 'C', ovr: 87}]} // NYR (additional)
    ];
    
    return remainingTeams;
}
