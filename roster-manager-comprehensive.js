// Comprehensive Roster Manager - All Leagues
// Manages NHL, CHL (OHL/WHL/QMJHL), USHL, NCAA, and European rosters
// Ensures draft prospects are mapped to their correct teams

class RosterManager {
    constructor() {
        this.nhlRosters = NHL_CURRENT_ROSTERS;
        this.chlRosters = CHL_ROSTERS;
        this.ushlRosters = USHL_ROSTERS;
        this.ncaaRosters = NCAA_ROSTERS;
        this.europeanRosters = EUROPEAN_ROSTERS;
        this.freeAgents = FREE_AGENTS_POOL;
    }

    // Get all players from a specific league
    getPlayersByLeague(league) {
        switch(league.toUpperCase()) {
            case 'NHL': return this.getAllNHLPlayers();
            case 'OHL': return this.getOHLPlayers();
            case 'WHL': return this.getWHLPlayers();
            case 'QMJHL': return this.getQMJHLPlayers();
            case 'USHL': return this.getUSHLPlayers();
            case 'NCAA': return this.getAllNCAAPlayers();
            case 'SHL': return this.getSHLPlayers();
            case 'LIIGA': return this.getLiigaPlayers();
            case 'KHL': return this.getKHLPlayers();
            default: return [];
        }
    }

    // Get specific team roster
    getTeamRoster(league, teamName) {
        const leagueRosters = this.getLeagueRosters(league);
        return leagueRosters[teamName] || null;
    }

    // Search for a player across all leagues
    searchPlayer(firstName, lastName) {
        const allPlayers = [
            ...this.getAllNHLPlayers(),
            ...this.getOHLPlayers(),
            ...this.getWHLPlayers(),
            ...this.getQMJHLPlayers(),
            ...this.getUSHLPlayers(),
            ...this.getAllNCAAPlayers(),
            ...this.getSHLPlayers(),
            ...this.getKHLPlayers()
        ];

        return allPlayers.filter(p => 
            p.firstName.toLowerCase() === firstName.toLowerCase() &&
            p.lastName.toLowerCase() === lastName.toLowerCase()
        );
    }

    // Get prospect's current team
    getProspectTeam(firstName, lastName, draftYear) {
        const draftClass = REAL_DRAFT_CLASSES[draftYear];
        if (!draftClass) return null;

        const prospect = draftClass.find(p =>
            p.firstName === firstName && p.lastName === lastName
        );

        return prospect ? { league: prospect.league, team: prospect.team } : null;
    }

    // Helper methods
    getAllNHLPlayers() {
        let players = [];
        for (let teamId in this.nhlRosters) {
            const team = this.nhlRosters[teamId];
            players = players.concat(team.forwards, team.defense, team.goalies);
        }
        return players;
    }

    getOHLPlayers() {
        return this.flattenRosters(this.chlRosters.OHL);
    }

    getWHLPlayers() {
        return this.flattenRosters(this.chlRosters.WHL);
    }

    getQMJHLPlayers() {
        return this.flattenRosters(this.chlRosters.QMJHL);
    }

    getUSHLPlayers() {
        return this.flattenRosters(this.ushlRosters);
    }

    getAllNCAAPlayers() {
        return this.flattenRosters(this.ncaaRosters);
    }

    getSHLPlayers() {
        return this.flattenRosters(this.europeanRosters.SHL);
    }

    getLiigaPlayers() {
        return this.flattenRosters(this.europeanRosters.Liiga);
    }

    getKHLPlayers() {
        return this.flattenRosters(this.europeanRosters.KHL);
    }

    flattenRosters(rosters) {
        let players = [];
        for (let teamName in rosters) {
            const team = rosters[teamName];
            if (team.forwards) players = players.concat(team.forwards);
            if (team.defense) players = players.concat(team.defense);
            if (team.goalies) players = players.concat(team.goalies);
        }
        return players;
    }

    getLeagueRosters(league) {
        switch(league.toUpperCase()) {
            case 'NHL': return this.nhlRosters;
            case 'OHL': return this.chlRosters.OHL;
            case 'WHL': return this.chlRosters.WHL;
            case 'QMJHL': return this.chlRosters.QMJHL;
            case 'USHL': return this.ushlRosters;
            case 'NCAA': return this.ncaaRosters;
            case 'SHL': return this.europeanRosters.SHL;
            case 'LIIGA': return this.europeanRosters.Liiga;
            case 'KHL': return this.europeanRosters.KHL;
            default: return {};
        }
    }
}

// Free Agents Pool - Notable unsigned players
const FREE_AGENTS_POOL = {
    forwards: [
        { firstName: 'Tyler', lastName: 'Johnson', position: 'C', age: 34, overall: 79, potential: 75 },
        { firstName: 'Max', lastName: 'Pacioretty', position: 'LW', age: 35, overall: 81, potential: 76 },
        { firstName: 'Corey', lastName: 'Perry', position: 'RW', age: 39, overall: 78, potential: 72 },
        { firstName: 'Ryan', lastName: 'Reaves', position: 'RW', age: 37, overall: 73, potential: 70 },
        { firstName: 'Nick', lastName: 'Ritchie', position: 'LW', age: 29, overall: 77, potential: 76 }
    ],
    defense: [
        { firstName: 'Tony', lastName: 'DeAngelo', position: 'RD', age: 29, overall: 80, potential: 79 },
        { firstName: 'Justin', lastName: 'Schultz', position: 'RD', age: 34, overall: 78, potential: 74 },
        { firstName: 'Colin', lastName: 'Miller', position: 'RD', age: 32, overall: 77, potential: 75 }
    ],
    goalies: [
        { firstName: 'Jonathan', lastName: 'Quick', position: 'G', age: 38, overall: 81, potential: 75 },
        { firstName: 'Antti', lastName: 'Raanta', position: 'G', age: 35, overall: 79, potential: 74 }
    ]
};

// CHL Rosters (OHL, WHL, QMJHL)
// Mapping draft prospects to their correct teams
const CHL_ROSTERS = {
    OHL: {
        'Erie Otters': {
            forwards: [
                // Matthew Schaefer is a defenseman, not forward - fixing
                { firstName: 'Malcolm', lastName: 'Spence', position: 'RW', age: 18, overall: 76, potential: 90, draftYear: 2026 },
                { firstName: 'Liam', lastName: 'Greentree', position: 'RW', age: 18, overall: 74, potential: 88, draftYear: 2024 },
                // Add depth players
                { firstName: 'Gabriel', lastName: 'Frasca', position: 'C', age: 19, overall: 68, potential: 75 },
                { firstName: 'Spencer', lastName: 'Sova', position: 'LW', age: 20, overall: 70, potential: 76 },
                { firstName: 'Carey', lastName: 'Terrance', position: 'RW', age: 19, overall: 69, potential: 74 },
                { firstName: 'Malcolm', lastName: 'Spence', position: 'RW', age: 18, overall: 76, potential: 90 },
                { firstName: 'Matthew', lastName: 'Maggio', position: 'C', age: 20, overall: 71, potential: 77 },
                { firstName: 'Connor', lastName: 'Lockhart', position: 'C', age: 19, overall: 70, potential: 76 },
                { firstName: 'Brett', lastName: 'Bressette', position: 'LW', age: 19, overall: 67, potential: 73 },
                { firstName: 'Kaleb', lastName: 'Smith', position: 'RW', age: 18, overall: 66, potential: 74 },
                { firstName: 'Daniel', lastName: 'D'Amato', position: 'C', age: 17, overall: 64, potential: 72 },
                { firstName: 'Noah', lastName: 'Van Vliet', position: 'LW', age: 17, overall: 63, potential: 71 }
            ],
            defense: [
                { firstName: 'Matthew', lastName: 'Schaefer', position: 'RD', age: 17, overall: 78, potential: 93, draftYear: 2026 },
                { firstName: 'Sam', lastName: 'Alfano', position: 'LD', age: 19, overall: 72, potential: 78 },
                { firstName: 'Spencer', lastName: 'Sova', position: 'RD', age: 20, overall: 70, potential: 75 },
                { firstName: 'Taeo', lastName: 'Artichuk', position: 'LD', age: 18, overall: 68, potential: 75 },
                { firstName: 'Alexis', lastName: 'Daviault', position: 'RD', age: 19, overall: 67, potential: 73 },
                { firstName: 'Pavel', lastName: 'Simek', position: 'LD', age: 18, overall: 66, potential: 74 }
            ],
            goalies: [
                { firstName: 'Noah', lastName: 'Erliden', position: 'G', age: 19, overall: 72, potential: 80 },
                { firstName: 'Charlie', lastName: 'Burns', position: 'G', age: 17, overall: 67, potential: 76 }
            ]
        },
        'Brampton Steelheads': {
            forwards: [
                { firstName: 'Porter', lastName: 'Martone', position: 'RW', age: 18, overall: 77, potential: 92, draftYear: 2026 },
                { firstName: 'Caden', lastName: 'Price', position: 'C', age: 17, overall: 77, potential: 92, draftYear: 2027 },
                { firstName: 'Carson', lastName: 'Rehkopf', position: 'LW', age: 19, overall: 71, potential: 79 },
                { firstName: 'Jack', lastName: 'Van Volsen', position: 'C', age: 19, overall: 69, potential: 75 },
                { firstName: 'Luke', lastName: 'Misa', position: 'C', age: 18, overall: 68, potential: 76 },
                { firstName: 'Adam', lastName: 'Zidlicky', position: 'RW', age: 20, overall: 70, potential: 74 },
                { firstName: 'Finn', lastName: 'Harding', position: 'LW', age: 19, overall: 67, potential: 73 },
                { firstName: 'Angus', lastName: 'MacDonell', position: 'C', age: 18, overall: 66, potential: 74 },
                { firstName: 'Spencer', lastName: 'Hazell', position: 'RW', age: 19, overall: 68, potential: 72 },
                { firstName: 'Hudson', lastName: 'Chitaroni', position: 'LW', age: 17, overall: 64, potential: 72 },
                { firstName: 'Tomas', lastName: 'Mrsic', position: 'C', age: 18, overall: 65, potential: 71 },
                { firstName: 'Patrick', lastName: 'Thomas', position: 'RW', age: 17, overall: 63, potential: 73 }
            ],
            defense: [
                { firstName: 'Porter', lastName: 'Martone', position: 'RD', age: 18, overall: 73, potential: 85 },
                { firstName: 'Luke', lastName: 'Misa', position: 'LD', age: 19, overall: 71, potential: 77 },
                { firstName: 'Antti', lastName: 'Halonen', position: 'RD', age: 19, overall: 69, potential: 75 },
                { firstName: 'Tanner', lastName: 'Winegard', position: 'LD', age: 20, overall: 68, potential: 73 },
                { firstName: 'Finn', lastName: 'Harding', position: 'RD', age: 18, overall: 67, potential: 74 },
                { firstName: 'Jacob', lastName: 'Mercer', position: 'LD', age: 17, overall: 65, potential: 72 }
            ],
            goalies: [
                { firstName: 'Jack', lastName: 'Ivankovic', position: 'G', age: 18, overall: 73, potential: 82 },
                { firstName: 'Spencer', lastName: 'Hazell', position: 'G', age: 17, overall: 66, potential: 74 }
            ]
        },
        'Saginaw Spirit': {
            forwards: [
                { firstName: 'Michael', lastName: 'Misa', position: 'C', age: 17, overall: 77, potential: 91, draftYear: 2026 },
                { firstName: 'Zayne', lastName: 'Parekh', position: 'RW', age: 18, overall: 74, potential: 87, draftYear: 2024 },
                { firstName: 'Igor', lastName: 'Chernyshov', position: 'LW', age: 19, overall: 72, potential: 81 },
                { firstName: 'Owen', lastName: 'Beck', position: 'C', age: 19, overall: 71, potential: 78 },
                { firstName: 'Sebastien', lastName: 'Gervais', position: 'C', age: 20, overall: 70, potential: 75 },
                { firstName: 'Mitchell', lastName: 'Smith', position: 'RW', age: 19, overall: 69, potential: 74 },
                { firstName: 'Ethan', lastName: 'Hay', position: 'LW', age: 18, overall: 68, potential: 75 },
                { firstName: 'Carson', lastName: 'Harmer', position: 'C', age: 19, overall: 67, potential: 72 },
                { firstName: 'Kristian', lastName: 'Epperson', position: 'RW', age: 17, overall: 66, potential: 74 },
                { firstName: 'Jacob', lastName: 'Cloutier', position: 'LW', age: 18, overall: 65, potential: 71 },
                { firstName: 'Lincoln', lastName: 'Moore', position: 'C', age: 17, overall: 64, potential: 73 },
                { firstName: 'Calem', lastName: 'Mangone', position: 'RW', age: 16, overall: 62, potential: 72 }
            ],
            defense: [
                { firstName: 'Zayne', lastName: 'Parekh', position: 'RD', age: 18, overall: 75, potential: 88 },
                { firstName: 'Nic', lastName: 'Sima', position: 'LD', age: 19, overall: 70, potential: 76 },
                { firstName: 'Ethan', lastName: 'Szypula', position: 'RD', age: 20, overall: 68, potential: 73 },
                { firstName: 'PJ', lastName: 'Fletcher', position: 'LD', age: 19, overall: 67, potential: 72 },
                { firstName: 'DJ', lastName: 'King', position: 'RD', age: 18, overall: 66, potential: 73 },
                { firstName: 'Andrew', lastName: 'Hayes', position: 'LD', age: 17, overall: 64, potential: 71 }
            ],
            goalies: [
                { firstName: 'Andrew', lastName: 'Oke', position: 'G', age: 19, overall: 74, potential: 81 },
                { firstName: 'Tristan', lastName: 'Lennox', position: 'G', age: 20, overall: 71, potential: 76 }
            ]
        },
        'Windsor Spitfires': {
            forwards: [
                { firstName: 'Liam', lastName: 'Greentree', position: 'RW', age: 18, overall: 74, potential: 88, draftYear: 2024 },
                { firstName: 'Matthew', lastName: 'Maggio', position: 'C', age: 20, overall: 72, potential: 77 },
                { firstName: 'Carter', lastName: 'Kostuch', position: 'LW', age: 19, overall: 69, potential: 75 },
                { firstName: 'Jack', lastName: 'Nesbitt', position: 'C', age: 20, overall: 71, potential: 74 },
                { firstName: 'Ethan', lastName: 'Garden', position: 'RW', age: 19, overall: 68, potential: 74 },
                { firstName: 'Alex', lastName: 'Christopoulos', position: 'C', age: 18, overall: 67, potential: 75 },
                { firstName: 'Ryan', lastName: 'Abraham', position: 'LW', age: 19, overall: 70, potential: 73 },
                { firstName: 'Cole', lastName: 'Davis', position: 'RW', age: 18, overall: 66, potential: 73 },
                { firstName: 'Lucas', lastName: 'Smeets', position: 'C', age: 17, overall: 65, potential: 74 },
                { firstName: 'Noah', lastName: 'Morneau', position: 'LW', age: 18, overall: 64, potential: 71 },
                { firstName: 'Michael', lastName: 'Elliot', position: 'RW', age: 17, overall: 63, potential: 72 },
                { firstName: 'Ryan', lastName: 'Winterton', position: 'C', age: 19, overall: 68, potential: 73 }
            ],
            defense: [
                { firstName: 'Ryan', lastName: 'Abraham', position: 'LD', age: 20, overall: 70, potential: 75 },
                { firstName: 'James', lastName: 'Jodoin', position: 'RD', age: 19, overall: 68, potential: 73 },
                { firstName: 'Joel', lastName: 'Janco', position: 'LD', age: 18, overall: 67, potential: 74 },
                { firstName: 'Connor', lastName: 'Toms', position: 'RD', age: 19, overall: 66, potential: 71 },
                { firstName: 'Anthony', lastName: 'Cristoforo', position: 'LD', age: 20, overall: 68, potential: 72 },
                { firstName: 'Michael', lastName: 'Renwick', position: 'RD', age: 17, overall: 64, potential: 72 }
            ],
            goalies: [
                { firstName: 'Joey', lastName: 'Costanzo', position: 'G', age: 18, overall: 71, potential: 79 },
                { firstName: 'Carter', lastName: 'Froggett', position: 'G', age: 19, overall: 68, potential: 74 }
            ]
        }
        // Add remaining 16 OHL teams...
    },
    
    WHL: {
        'Medicine Hat Tigers': {
            forwards: [
                { firstName: 'Gavin', lastName: 'McKenna', position: 'C', age: 16, overall: 78, potential: 95, draftYear: 2027 },
                { firstName: 'Andrew', lastName: 'Basha', position: 'C', age: 18, overall: 69, potential: 83, draftYear: 2024 },
                { firstName: 'Brady', lastName: 'Cleveland', position: 'C', age: 18, overall: 67, potential: 80, draftYear: 2026 },
                { firstName: 'Hunter', lastName: 'St. Martin', position: 'RW', age: 19, overall: 70, potential: 75 },
                { firstName: 'Gavin', lastName: 'McKenna', position: 'C', age: 16, overall: 78, potential: 95 },
                { firstName: 'Marcus', lastName: 'Pacheco', position: 'LW', age: 19, overall: 68, potential: 73 },
                { firstName: 'Ryder', lastName: 'Ritchie', position: 'C', age: 18, overall: 68, potential: 81 },
                { firstName: 'Josh', lastName: 'Van Mulligen', position: 'RW', age: 20, overall: 69, potential: 72 },
                { firstName: 'Mathew', lastName: 'Ward', position: 'LW', age: 19, overall: 67, potential: 74 },
                { firstName: 'Bryce', lastName: 'Pickford', position: 'C', age: 18, overall: 66, potential: 72 },
                { firstName: 'Shane', lastName: 'Smith', position: 'RW', age: 17, overall: 65, potential: 73 },
                { firstName: 'Kadon', lastName: 'McCann', position: 'LW', age: 17, overall: 64, potential: 71 }
            ],
            defense: [
                { firstName: 'Veeti', lastName: 'Vaisanen', position: 'LD', age: 19, overall: 71, potential: 78 },
                { firstName: 'Oasiz', lastName: 'Wiesblatt', position: 'RD', age: 20, overall: 69, potential: 74 },
                { firstName: 'Andrew', lastName: 'Basha', position: 'LD', age: 19, overall: 68, potential: 75 },
                { firstName: 'Hunter', lastName: 'Laing', position: 'RD', age: 18, overall: 67, potential: 74 },
                { firstName: 'Jonas', lastName: 'Woo', position: 'LD', age: 17, overall: 65, potential: 73 },
                { firstName: 'Braden', lastName: 'Mateja', position: 'RD', age: 18, overall: 66, potential: 71 }
            ],
            goalies: [
                { firstName: 'Harrison', lastName: 'Meneghin', position: 'G', age: 19, overall: 72, potential: 79 },
                { firstName: 'Jordan', lastName: 'Switzer', position: 'G', age: 17, overall: 67, potential: 75 }
            ]
        },
        'Vancouver Giants': {
            forwards: [
                { firstName: 'Cameron', lastName: 'Schmidt', position: 'C', age: 18, overall: 75, potential: 89, draftYear: 2026 },
                { firstName: 'Tyler', lastName: 'Thorpe', position: 'LW', age: 19, overall: 70, potential: 76 },
                { firstName: 'Connor', lastName: 'Levis', position: 'RW', age: 20, overall: 71, potential: 74 },
                { firstName: 'Samuel', lastName: 'Honzek', position: 'C', age: 19, overall: 72, potential: 82 },
                { firstName: 'Zack', lastName: 'Ostapchuk', position: 'C', age: 20, overall: 70, potential: 75 },
                { firstName: 'Ty', lastName: 'Halaburda', position: 'RW', age: 19, overall: 68, potential: 74 },
                { firstName: 'Jakob', lastName: 'Oreskovic', position: 'LW', age: 18, overall: 67, potential: 75 },
                { firstName: 'Julian', lastName: 'Cull', position: 'C', age: 19, overall: 66, potential: 71 },
                { firstName: 'Ethan', lastName: 'Semeniuk', position: 'RW', age: 18, overall: 65, potential: 73 },
                { firstName: 'Kyren', lastName: 'Gronick', position: 'LW', age: 17, overall: 64, potential: 72 },
                { firstName: 'Brett', lastName: 'Olson', position: 'C', age: 17, overall: 63, potential: 71 },
                { firstName: 'James', lastName: 'Malm', position: 'RW', age: 19, overall: 67, potential: 72 }
            ],
            defense: [
                { firstName: 'Mazden', lastName: 'Leslie', position: 'LD', age: 19, overall: 70, potential: 77 },
                { firstName: 'Connor', lastName: 'Horning', position: 'RD', age: 20, overall: 69, potential: 74 },
                { firstName: 'Tanner', lastName: 'Brown', position: 'LD', age: 19, overall: 68, potential: 73 },
                { firstName: 'Aaron', lastName: 'Obobaifo', position: 'RD', age: 18, overall: 67, potential: 74 },
                { firstName: 'Kyren', lastName: 'Gronick', position: 'LD', age: 17, overall: 65, potential: 73 },
                { firstName: 'Samuel', lastName: 'Honzek', position: 'RD', age: 18, overall: 66, potential: 72 }
            ],
            goalies: [
                { firstName: 'Jesper', lastName: 'Vikman', position: 'G', age: 20, overall: 73, potential: 79 },
                { firstName: 'Brett', lastName: 'Mirwald', position: 'G', age: 18, overall: 68, potential: 75 }
            ]
        }
        // Add remaining 20 WHL teams...
    },

    QMJHL: {
        'Moncton Wildcats': {
            forwards: [
                { firstName: 'Caleb', lastName: 'Desnoyers', position: 'C', age: 18, overall: 74, potential: 88, draftYear: 2026 },
                { firstName: 'Jacob', lastName: 'Steinman', position: 'LW', age: 19, overall: 70, potential: 76 },
                { firstName: 'Maxime', lastName: 'Massé', position: 'RW', age: 18, overall: 70, potential: 84 },
                { firstName: 'Markus', lastName: 'Vidicek', position: 'C', age: 20, overall: 71, potential: 74 },
                { firstName: 'Étienne', lastName: 'Morin', position: 'LW', age: 19, overall: 68, potential: 74 },
                { firstName: 'Vincent', lastName: 'Leblanc', position: 'RW', age: 18, overall: 67, potential: 75 },
                { firstName: 'Shawn', lastName: 'Element', position: 'C', age: 19, overall: 69, potential: 72 },
                { firstName: 'Yoan', lastName: 'Loshing', position: 'LW', age: 18, overall: 66, potential: 73 },
                { firstName: 'Alexandre', lastName: 'Lefebvre', position: 'RW', age: 17, overall: 65, potential: 74 },
                { firstName: 'Mathis', lastName: 'Cloutier', position: 'C', age: 17, overall: 64, potential: 71 },
                { firstName: 'Alex', lastName: 'MacDonald', position: 'LW', age: 16, overall: 62, potential: 72 },
                { firstName: 'Liam', lastName: 'Leonard', position: 'RW', age: 18, overall: 66, potential: 71 }
            ],
            defense: [
                { firstName: 'Julien', lastName: 'Letourneau', position: 'LD', age: 19, overall: 70, potential: 76 },
                { firstName: 'Alexis', lastName: 'Gendron', position: 'RD', age: 20, overall: 68, potential: 73 },
                { firstName: 'Charles', lastName: 'Tremblay', position: 'LD', age: 19, overall: 67, potential: 74 },
                { firstName: 'Isaac', lastName: 'Belliveau', position: 'RD', age: 18, overall: 66, potential: 73 },
                { firstName: 'Vincent', lastName: 'Milot', position: 'LD', age: 17, overall: 64, potential: 72 },
                { firstName: 'Noah', lastName: 'Lavoie', position: 'RD', age: 17, overall: 63, potential: 71 }
            ],
            goalies: [
                { firstName: 'Vincent', lastName: 'Filion', position: 'G', age: 19, overall: 72, potential: 78 },
                { firstName: 'Joshua', lastName: 'Fleming', position: 'G', age: 17, overall: 67, potential: 75 }
            ]
        },
        'Baie-Comeau Drakkar': {
            forwards: [
                { firstName: 'Justin', lastName: 'Poirier', position: 'RW', age: 18, overall: 73, potential: 86, draftYear: 2026 },
                { firstName: 'Olivier', lastName: 'Nadeau', position: 'C', age: 19, overall: 71, potential: 77 },
                { firstName: 'Marc-Antoine', lastName: 'Pépin', position: 'LW', age: 20, overall: 70, potential: 74 },
                { firstName: 'Alexis', lastName: 'Gendron', position: 'RW', age: 19, overall: 68, potential: 75 },
                { firstName: 'Julien', lastName: 'Msika', position: 'C', age: 18, overall: 67, potential: 74 },
                { firstName: 'Raoul', lastName: 'Boilard', position: 'LW', age: 19, overall: 69, potential: 72 },
                { firstName: 'Nathan', lastName: 'Légaré', position: 'RW', age: 20, overall: 68, potential: 71 },
                { firstName: 'Cédrick', lastName: 'Guindon', position: 'C', age: 18, overall: 66, potential: 73 },
                { firstName: 'Marc-Olivier', lastName: 'Crevier-Morin', position: 'LW', age: 17, overall: 65, potential: 74 },
                { firstName: 'William', lastName: 'Dufour', position: 'RW', age: 19, overall: 67, potential: 72 },
                { firstName: 'Pierre-Olivier', lastName: 'Joseph', position: 'C', age: 17, overall: 64, potential: 71 },
                { firstName: 'Samuel', lastName: 'Savoie', position: 'LW', age: 18, overall: 65, potential: 71 }
            ],
            defense: [
                { firstName: 'Jérémie', lastName: 'Biakabutuka', position: 'LD', age: 19, overall: 69, potential: 76 },
                { firstName: 'Alexis', lastName: 'Sansfaçon', position: 'RD', age: 20, overall: 68, potential: 73 },
                { firstName: 'Gabriel', lastName: 'Proulx', position: 'LD', age: 19, overall: 67, potential: 73 },
                { firstName: 'Luca', lastName: 'Cagnoni', position: 'RD', age: 18, overall: 70, potential: 79 },
                { firstName: 'Xavier', lastName: 'Fortin', position: 'LD', age: 17, overall: 65, potential: 72 },
                { firstName: 'Maxence', lastName: 'Guénette', position: 'RD', age: 18, overall: 66, potential: 71 }
            ],
            goalies: [
                { firstName: 'Lucas', lastName: 'Beckman', position: 'G', age: 19, overall: 71, potential: 77 },
                { firstName: 'Andrew', lastName: 'Oke', position: 'G', age: 17, overall: 68, potential: 76 }
            ]
        }
        // Add remaining 16 QMJHL teams...
    }
};

// USHL Rosters
const USHL_ROSTERS = {
    'Chicago Steel': {
        forwards: [
            { firstName: 'James', lastName: 'Hagens', position: 'C', age: 17, overall: 79, potential: 94, draftYear: 2026 },
            { firstName: 'William', lastName: 'Zellers', position: 'RW', age: 17, overall: 73, potential: 87, draftYear: 2027 },
            { firstName: 'Teddy', lastName: 'Stiga', position: 'C', age: 18, overall: 61, potential: 74, draftYear: 2026 },
            { firstName: 'Adam', lastName: 'Benák', position: 'LW', age: 19, overall: 68, potential: 74 },
            { firstName: 'Jackson', lastName: 'Hallum', position: 'RW', age: 18, overall: 67, potential: 75 },
            { firstName: 'Sam', lastName: 'Lipkin', position: 'C', age: 20, overall: 70, potential: 73 },
            { firstName: 'Tobias', lastName: 'Ohman', position: 'LW', age: 19, overall: 66, potential: 72 },
            { firstName: 'Luke', lastName: 'Goukler', position: 'RW', age: 18, overall: 65, potential: 73 },
            { firstName: 'Tyler', lastName: 'Duke', position: 'C', age: 19, overall: 68, potential: 71 },
            { firstName: 'Ben', lastName: 'Strinden', position: 'LW', age: 17, overall: 64, potential: 72 },
            { firstName: 'Charlie', lastName: 'Pardue', position: 'RW', age: 18, overall: 63, potential: 71 },
            { firstName: 'Michael', lastName: 'Emerson', position: 'C', age: 17, overall: 62, potential: 73 }
        ],
        defense: [
            { firstName: 'Cullen', lastName: 'Potter', position: 'RD', age: 18, overall: 75, potential: 89, draftYear: 2026 },
            { firstName: 'Artyom', lastName: 'Levshunov', position: 'RD', age: 19, overall: 76, potential: 91 },
            { firstName: 'Sam', lastName: 'Rinzel', position: 'LD', age: 19, overall: 71, potential: 81 },
            { firstName: 'Aidan', lastName: 'Hreschuk', position: 'RD', age: 20, overall: 69, potential: 74 },
            { firstName: 'Blake', lastName: 'McLaughlin', position: 'LD', age: 18, overall: 66, potential: 73 },
            { firstName: 'Liam', lastName: 'Connors', position: 'RD', age: 17, overall: 64, potential: 72 }
        ],
        goalies: [
            { firstName: 'Jack', lastName: 'Parsons', position: 'G', age: 19, overall: 72, potential: 79 },
            { firstName: 'Gibson', lastName: 'Homer', position: 'G', age: 18, overall: 68, potential: 76 }
        ]
    },
    'USA U18': {
        forwards: [
            { firstName: 'Jack', lastName: 'Murtagh', position: 'C', age: 17, overall: 73, potential: 87, draftYear: 2026 },
            { firstName: 'Cole', lastName: 'Hutson', position: 'C', age: 17, overall: 72, potential: 85 },
            { firstName: 'EJ', lastName: 'Emery', position: 'C', age: 17, overall: 68, potential: 82 },
            { firstName: 'Brodie', lastName: 'Ziemer', position: 'LW', age: 17, overall: 63, potential: 76 },
            { firstName: 'Ryan', lastName: 'Leonard', position: 'RW', age: 18, overall: 74, potential: 85 },
            { firstName: 'Gabe', lastName: 'Perreault', position: 'C', age: 18, overall: 73, potential: 86 },
            { firstName: 'Will', lastName: 'Smith', position: 'C', age: 19, overall: 75, potential: 89 },
            { firstName: 'Drew', lastName: 'Fortescue', position: 'LW', age: 17, overall: 65, potential: 74 },
            { firstName: 'Gracyn', lastName: 'Sawchyn', position: 'RW', age: 17, overall: 64, potential: 75 },
            { firstName: 'Oliver', lastName: 'Moore', position: 'C', age: 19, overall: 72, potential: 83 },
            { firstName: 'Cruz', lastName: 'Lucius', position: 'RW', age: 18, overall: 68, potential: 78 },
            { firstName: 'Charlie', lastName: 'Stramel', position: 'LW', age: 19, overall: 69, potential: 76 }
        ],
        defense: [
            { firstName: 'Cole', lastName: 'Hutson', position: 'LD', age: 17, overall: 72, potential: 85 },
            { firstName: 'EJ', lastName: 'Emery', position: 'LD', age: 17, overall: 68, potential: 82 },
            { firstName: 'Lane', lastName: 'Hutson', position: 'LD', age: 20, overall: 75, potential: 87 },
            { firstName: 'Zeev', lastName: 'Buium', position: 'LD', age: 19, overall: 74, potential: 85 },
            { firstName: 'Isaac', lastName: 'Howard', position: 'RD', age: 19, overall: 70, potential: 78 },
            { firstName: 'Logan', lastName: 'Cooley', position: 'RD', age: 20, overall: 73, potential: 83 }
        ],
        goalies: [
            { firstName: 'Trey', lastName: 'Augustine', position: 'G', age: 18, overall: 74, potential: 86 },
            { firstName: 'Tyler', lastName: 'Muszelik', position: 'G', age: 17, overall: 69, potential: 78 }
        ]
    }
    // Add remaining 14 USHL teams...
};

// NCAA Rosters (sample schools)
const NCAA_ROSTERS = {
    'University of Michigan': {
        forwards: [
            { firstName: 'Adam', lastName: 'Fantilli', position: 'C', age: 19, overall: 77, potential: 93 },
            { firstName: 'Gavin', lastName: 'Brindley', position: 'C', age: 20, overall: 72, potential: 80 },
            { firstName: 'Dylan', lastName: 'Duke', position: 'LW', age: 21, overall: 74, potential: 79 },
            { firstName: 'T.J.', lastName: 'Hughes', position: 'RW', age: 19, overall: 70, potential: 81 },
            { firstName: 'Rutger', lastName: 'McGroarty', position: 'RW', age: 20, overall: 73, potential: 84 },
            { firstName: 'Frank', lastName: 'Nazar', position: 'C', age: 19, overall: 71, potential: 83 },
            { firstName: 'Red', lastName: 'Savage', position: 'LW', age: 21, overall: 68, potential: 74 },
            { firstName: 'Kienan', lastName: 'Draper', position: 'C', age: 20, overall: 67, potential: 73 },
            { firstName: 'Luke', lastName: 'Hughes', position: 'RW', age: 19, overall: 69, potential: 78 },
            { firstName: 'Mark', lastName: 'Estapa', position: 'LW', age: 22, overall: 70, potential: 72 },
            { firstName: 'Philippe', lastName: 'Lapointe', position: 'C', age: 21, overall: 66, potential: 71 },
            { firstName: 'Alex', lastName: 'Bump', position: 'RW', age: 20, overall: 65, potential: 72 }
        ],
        defense: [
            { firstName: 'Luke', lastName: 'Hughes', position: 'LD', age: 19, overall: 75, potential: 90 },
            { firstName: 'Owen', lastName: 'Power', position: 'LD', age: 21, overall: 78, potential: 91 },
            { firstName: 'Seamus', lastName: 'Casey', position: 'RD', age: 20, overall: 72, potential: 82 },
            { firstName: 'Jacob', lastName: 'Truscott', position: 'LD', age: 21, overall: 70, potential: 76 },
            { firstName: 'Ethan', lastName: 'Edwards', position: 'RD', age: 21, overall: 69, potential: 75 },
            { firstName: 'Luca', lastName: 'Fantilli', position: 'RD', age: 18, overall: 67, potential: 77 }
        ],
        goalies: [
            { firstName: 'Erik', lastName: 'Portillo', position: 'G', age: 22, overall: 74, potential: 81 },
            { firstName: 'Noah', lastName: 'Grannan', position: 'G', age: 20, overall: 69, potential: 76 }
        ]
    },
    'Boston University': {
        forwards: [
            { firstName: 'Macklin', lastName: 'Celebrini', position: 'C', age: 17, overall: 78, potential: 95 },
            { firstName: 'Ryan', lastName: 'Leonard', position: 'RW', age: 18, overall: 74, potential: 85 },
            { firstName: 'Gabe', lastName: 'Perreault', position: 'C', age: 18, overall: 73, potential: 86 },
            { firstName: 'Shane', lastName: 'Lachance', position: 'LW', age: 20, overall: 70, potential: 76 },
            { firstName: 'Matt', lastName: 'Coronato', position: 'RW', age: 21, overall: 73, potential: 82 },
            { firstName: 'Jay', lastName: "O'Brien", position: 'C', age: 23, overall: 68, potential: 72 },
            { firstName: 'Wilmer', lastName: 'Skoog', position: 'LW', age: 21, overall: 67, potential: 73 },
            { firstName: 'Dylan', lastName: 'Peterson', position: 'RW', age: 20, overall: 66, potential: 74 },
            { firstName: 'Luke', lastName: 'Tuch', position: 'C', age: 21, overall: 69, potential: 75 },
            { firstName: 'Devin', lastName: 'Kaplan', position: 'LW', age: 19, overall: 65, potential: 73 },
            { firstName: 'Cole', lastName: 'Hutson', position: 'RW', age: 17, overall: 64, potential: 76 },
            { firstName: 'Quinn', lastName: 'Hutson', position: 'C', age: 19, overall: 68, potential: 74 }
        ],
        defense: [
            { firstName: 'Lane', lastName: 'Hutson', position: 'LD', age: 20, overall: 75, potential: 87 },
            { firstName: 'Tom', lastName: 'Willander', position: 'RD', age: 19, overall: 72, potential: 83 },
            { firstName: 'Ty', lastName: 'Gallagher', position: 'LD', age: 21, overall: 68, potential: 74 },
            { firstName: 'Aidan', lastName: 'Celebrini', position: 'RD', age: 21, overall: 70, potential: 75 },
            { firstName: 'Case', lastName: 'McCarthy', position: 'LD', age: 20, overall: 67, potential: 73 },
            { firstName: 'Roman', lastName: 'Schmidt', position: 'RD', age: 22, overall: 69, potential: 72 }
        ],
        goalies: [
            { firstName: 'Drew', lastName: 'Commesso', position: 'G', age: 21, overall: 73, potential: 82 },
            { firstName: 'Mathieu', lastName: 'Caron', position: 'G', age: 20, overall: 68, potential: 75 }
        ]
    }
    // Add remaining 58 NCAA teams...
};

// European Rosters (sample teams)
const EUROPEAN_ROSTERS = {
    SHL: {
        'Djurgårdens IF': {
            forwards: [
                { firstName: 'Anton', lastName: 'Frondell', position: 'LW', age: 18, overall: 76, potential: 90, draftYear: 2026 },
                { firstName: 'Victor', lastName: 'Eklund', position: 'LW', age: 18, overall: 73, potential: 86, draftYear: 2026 },
                { firstName: 'Noah', lastName: 'Östlund', position: 'C', age: 20, overall: 72, potential: 78 },
                { firstName: 'Liam', lastName: 'Öhgren', position: 'LW', age: 20, overall: 73, potential: 82 },
                { firstName: 'Axel', lastName: 'Sandin Pellikka', position: 'RW', age: 19, overall: 71, potential: 83 },
                { firstName: 'Otto', lastName: 'Stenberg', position: 'C', age: 19, overall: 70, potential: 79 },
                { firstName: 'Ludvig', lastName: 'Persson', position: 'LW', age: 21, overall: 69, potential: 74 },
                { firstName: 'Emil', lastName: 'Heineman', position: 'RW', age: 22, overall: 71, potential: 76 },
                { firstName: 'Filip', lastName: 'Johansson', position: 'C', age: 23, overall: 68, potential: 71 },
                { firstName: 'Marcus', lastName: 'Karlberg', position: 'LW', age: 24, overall: 70, potential: 72 },
                { firstName: 'Jonathan', lastName: 'Lekkerimäki', position: 'RW', age: 19, overall: 72, potential: 83 },
                { firstName: 'Tobias', lastName: 'Björnfot', position: 'C', age: 22, overall: 67, potential: 71 }
            ],
            defense: [
                { firstName: 'Simon', lastName: 'Edvinsson', position: 'LD', age: 21, overall: 74, potential: 85 },
                { firstName: 'Emil', lastName: 'Andrae', position: 'LD', age: 22, overall: 71, potential: 78 },
                { firstName: 'William', lastName: 'Wallinder', position: 'RD', age: 21, overall: 70, potential: 79 },
                { firstName: 'Calle', lastName: 'Själin', position: 'LD', age: 23, overall: 68, potential: 73 },
                { firstName: 'Adam', lastName: 'Samuelsson', position: 'RD', age: 24, overall: 69, potential: 72 },
                { firstName: 'Marcus', lastName: 'Westfält', position: 'LD', age: 25, overall: 67, potential: 70 }
            ],
            goalies: [
                { firstName: 'Hugo', lastName: 'Alnefelt', position: 'G', age: 22, overall: 72, potential: 80 },
                { firstName: 'Niklas', lastName: 'Rubin', position: 'G', age: 24, overall: 68, potential: 73 }
            ]
        }
        // Add more SHL teams...
    },
    
    Liiga: {
        'TPS Turku': {
            forwards: [
                { firstName: 'Konsta', lastName: 'Helenius', position: 'C', age: 18, overall: 75, potential: 88 },
                { firstName: 'Jesse', lastName: 'Kiiskinen', position: 'LW', age: 20, overall: 70, potential: 76 },
                { firstName: 'Joakim', lastName: 'Kemell', position: 'RW', age: 20, overall: 73, potential: 83 },
                { firstName: 'Roby', lastName: 'Järventie', position: 'LW', age: 21, overall: 71, potential: 78 },
                { firstName: 'Ville', lastName: 'Koivunen', position: 'RW', age: 21, overall: 70, potential: 77 },
                { firstName: 'Brad', lastName: 'Lambert', position: 'C', age: 21, overall: 73, potential: 84 },
                { firstName: 'Kasper', lastName: 'Simontaival', position: 'LW', age: 20, overall: 68, potential: 75 },
                { firstName: 'Matias', lastName: 'Maccelli', position: 'RW', age: 24, overall: 72, potential: 76 },
                { firstName: 'Eetu', lastName: 'Luostarinen', position: 'C', age: 25, overall: 71, potential: 73 },
                { firstName: 'Topias', lastName: 'Vilen', position: 'LW', age: 22, overall: 67, potential: 72 },
                { firstName: 'Santeri', lastName: 'Hatakka', position: 'RW', age: 23, overall: 68, potential: 71 },
                { firstName: 'Mikael', lastName: 'Pyyhtiä', position: 'C', age: 23, overall: 69, potential: 72 }
            ],
            defense: [
                { firstName: 'Kasper', lastName: 'Puutio', position: 'LD', age: 21, overall: 70, potential: 78 },
                { firstName: 'Topi', lastName: 'Niemelä', position: 'RD', age: 22, overall: 72, potential: 79 },
                { firstName: 'Ville', lastName: 'Heinola', position: 'LD', age: 23, overall: 73, potential: 80 },
                { firstName: 'Lassi', lastName: 'Thomson', position: 'RD', age: 23, overall: 69, potential: 74 },
                { firstName: 'Eemil', lastName: 'Viro', position: 'LD', age: 24, overall: 68, potential: 72 },
                { firstName: 'Santeri', lastName: 'Hatakka', position: 'RD', age: 25, overall: 67, potential: 70 }
            ],
            goalies: [
                { firstName: 'Leevi', lastName: 'Meriläinen', position: 'G', age: 22, overall: 71, potential: 78 },
                { firstName: 'Joel', lastName: 'Blomqvist', position: 'G', age: 21, overall: 73, potential: 81 }
            ]
        }
        // Add more Liiga teams...
    },

    KHL: {
        'SKA St. Petersburg': {
            forwards: [
                { firstName: 'Matvei', lastName: 'Michkov', position: 'RW', age: 19, overall: 77, potential: 94 },
                { firstName: 'Danill', lastName: 'Yurov', position: 'LW', age: 20, overall: 72, potential: 85 },
                { firstName: 'Ivan', lastName: 'Ryabkin', position: 'C', age: 18, overall: 74, potential: 88 },
                { firstName: 'Pavel', lastName: 'Moysevich', position: 'RW', age: 22, overall: 70, potential: 75 },
                { firstName: 'Nikita', lastName: 'Chibrikov', position: 'LW', age: 21, overall: 71, potential: 79 },
                { firstName: 'Dmitri', lastName: 'Buchelnikov', position: 'C', age: 21, overall: 69, potential: 77 },
                { firstName: 'Zakhar', lastName: 'Bardakov', position: 'RW', age: 23, overall: 68, potential: 73 },
                { firstName: 'Vladimir', lastName: 'Alistrov', position: 'LW', age: 24, overall: 70, potential: 72 },
                { firstName: 'Fyodor', lastName: 'Svechkov', position: 'C', age: 22, overall: 71, potential: 76 },
                { firstName: 'Makar', lastName: 'Khanin', position: 'RW', age: 23, overall: 67, potential: 71 },
                { firstName: 'Ilya', lastName: 'Nikolaev', position: 'LW', age: 24, overall: 68, potential: 70 },
                { firstName: 'Sergei', lastName: 'Ivanov', position: 'C', age: 25, overall: 69, potential: 71 }
            ],
            defense: [
                { firstName: 'Daniil', lastName: 'Chayka', position: 'RD', age: 20, overall: 73, potential: 84 },
                { firstName: 'Pavel', lastName: 'Mintyukov', position: 'LD', age: 21, overall: 74, potential: 85 },
                { firstName: 'Kirill', lastName: 'Kudryavtsev', position: 'RD', age: 22, overall: 70, potential: 77 },
                { firstName: 'Alexander', lastName: 'Romanov', position: 'LD', age: 24, overall: 72, potential: 76 },
                { firstName: 'Vladislav', lastName: 'Gavrikov', position: 'RD', age: 28, overall: 81, potential: 81 },
                { firstName: 'Dmitry', lastName: 'Orlov', position: 'LD', age: 32, overall: 83, potential: 79 }
            ],
            goalies: [
                { firstName: 'Yaroslav', lastName: 'Askarov', position: 'G', age: 22, overall: 76, potential: 88 },
                { firstName: 'Pyotr', lastName: 'Kochetkov', position: 'G', age: 25, overall: 74, potential: 80 }
            ]
        }
        // Add more KHL teams...
    }
};

// Initialize the roster manager
const rosterManager = new RosterManager();
