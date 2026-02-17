// Game Data - Teams and Leagues
const LEAGUES = [
    { id: 1, name: 'National Hockey League', abbr: 'NHL', level: 6, country: 'USA/CAN', prestige: 100 },
    { id: 2, name: 'American Hockey League', abbr: 'AHL', level: 5, country: 'USA/CAN', prestige: 85 },
    { id: 3, name: 'ECHL', abbr: 'ECHL', level: 4, country: 'USA/CAN', prestige: 70 },
    { id: 4, name: 'Ontario Hockey League', abbr: 'OHL', level: 3, country: 'CAN/USA', prestige: 78 },
    { id: 5, name: 'Western Hockey League', abbr: 'WHL', level: 3, country: 'CAN/USA', prestige: 78 },
    { id: 6, name: 'Quebec Maritimes Junior Hockey League', abbr: 'QMJHL', level: 3, country: 'CAN', prestige: 77 },
    { id: 7, name: 'United States Hockey League', abbr: 'USHL', level: 3, country: 'USA', prestige: 76 },
    { id: 8, name: 'North American Hockey League', abbr: 'NAHL', level: 2, country: 'USA', prestige: 65 },
    { id: 9, name: 'Minnesota State High School League', abbr: 'MSHSL', level: 1, country: 'USA', prestige: 50 }
];

const TEAMS = [
    // NHL Teams (League ID: 1)
    { id: 1, name: 'Boston Bruins', city: 'Boston', arena: 'TD Garden', leagueId: 1, rating: 88 },
    { id: 2, name: 'Toronto Maple Leafs', city: 'Toronto', arena: 'Scotiabank Arena', leagueId: 1, rating: 87 },
    { id: 3, name: 'Montreal Canadiens', city: 'Montreal', arena: 'Bell Centre', leagueId: 1, rating: 82 },
    { id: 4, name: 'Tampa Bay Lightning', city: 'Tampa Bay', arena: 'Amalie Arena', leagueId: 1, rating: 90 },
    { id: 5, name: 'Colorado Avalanche', city: 'Denver', arena: 'Ball Arena', leagueId: 1, rating: 91 },
    { id: 6, name: 'Vegas Golden Knights', city: 'Las Vegas', arena: 'T-Mobile Arena', leagueId: 1, rating: 88 },
    { id: 7, name: 'Edmonton Oilers', city: 'Edmonton', arena: 'Rogers Place', leagueId: 1, rating: 89 },
    { id: 8, name: 'New York Rangers', city: 'New York', arena: 'Madison Square Garden', leagueId: 1, rating: 86 },
    
    // AHL Teams (League ID: 2)
    { id: 101, name: 'Providence Bruins', city: 'Providence', arena: 'Dunkin\' Donuts Center', leagueId: 2, rating: 78 },
    { id: 102, name: 'Toronto Marlies', city: 'Toronto', arena: 'Coca-Cola Coliseum', leagueId: 2, rating: 77 },
    { id: 103, name: 'Syracuse Crunch', city: 'Syracuse', arena: 'Upstate Medical University Arena', leagueId: 2, rating: 79 },
    { id: 104, name: 'Colorado Eagles', city: 'Loveland', arena: 'Budweiser Events Center', leagueId: 2, rating: 80 },
    
    // OHL Teams (League ID: 4)
    { id: 201, name: 'London Knights', city: 'London', arena: 'Budweiser Gardens', leagueId: 4, rating: 85 },
    { id: 202, name: 'Ottawa 67\'s', city: 'Ottawa', arena: 'TD Place Arena', leagueId: 4, rating: 82 },
    { id: 203, name: 'Kitchener Rangers', city: 'Kitchener', arena: 'The Aud', leagueId: 4, rating: 83 },
    { id: 204, name: 'Windsor Spitfires', city: 'Windsor', arena: 'WFCU Centre', leagueId: 4, rating: 81 },
    { id: 205, name: 'Saginaw Spirit', city: 'Saginaw', arena: 'Dow Event Center', leagueId: 4, rating: 80 },
    
    // NAHL Teams (League ID: 8)
    { id: 301, name: 'Minnesota Magicians', city: 'Richfield', arena: 'Richfield Ice Arena', leagueId: 8, rating: 72 },
    { id: 302, name: 'Bismarck Bobcats', city: 'Bismarck', arena: 'V.F.W. Sports Center', leagueId: 8, rating: 71 },
    { id: 303, name: 'Aberdeen Wings', city: 'Aberdeen', arena: 'Odde Ice Center', leagueId: 8, rating: 70 },
    
    // High School Teams (League ID: 9)
    { id: 401, name: 'Edina Hornets', city: 'Edina', arena: 'Braemar Arena', leagueId: 9, rating: 78 },
    { id: 402, name: 'Wayzata Trojans', city: 'Plymouth', arena: 'Plymouth Ice Center', leagueId: 9, rating: 76 },
    { id: 403, name: 'Minnetonka Skippers', city: 'Minnetonka', arena: 'Minnetonka Ice Arena', leagueId: 9, rating: 75 },
    { id: 404, name: 'Hill-Murray Pioneers', city: 'Maplewood', arena: 'Aldrich Arena', leagueId: 9, rating: 74 },
    { id: 405, name: 'Blaine Bengals', city: 'Blaine', arena: 'Schwan Super Rink', leagueId: 9, rating: 73 },
    { id: 406, name: 'Duluth East Greyhounds', city: 'Duluth', arena: 'Mars Lakeview Arena', leagueId: 9, rating: 72 },
    { id: 407, name: 'St. Thomas Academy Cadets', city: 'Mendota Heights', arena: 'St. Thomas Ice Arena', leagueId: 9, rating: 71 },
    { id: 408, name: 'Benilde-St. Margaret\'s Red Knights', city: 'St. Louis Park', arena: 'St. Louis Park Rec Center', leagueId: 9, rating: 70 }
];

const SKILLS = [
    'Skating',
    'Shooting Accuracy',
    'Shooting Power',
    'Puck Control',
    'Passing',
    'Checking',
    'Defensive Positioning',
    'Hockey IQ',
    'Strength',
    'Conditioning'
];

// Helper functions
function getTeamsForLeague(leagueId) {
    return TEAMS.filter(team => team.leagueId === leagueId);
}

function getTeamById(teamId) {
    return TEAMS.find(team => team.id === teamId);
}

function getLeagueById(leagueId) {
    return LEAGUES.find(league => league.id === leagueId);
}
