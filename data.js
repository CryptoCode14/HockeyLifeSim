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

// Player Personality Traits
const PERSONALITY_TRAITS = [
    { id: 'leader', name: 'Leader', description: 'Boosts team morale' },
    { id: 'clutch', name: 'Clutch Performer', description: 'Better in pressure situations' },
    { id: 'sniper', name: 'Natural Sniper', description: 'Better shooting accuracy' },
    { id: 'playmaker', name: 'Playmaker', description: 'Better passing and assists' },
    { id: 'grinder', name: 'Grinder', description: 'Never gives up, high conditioning' },
    { id: 'enforcer', name: 'Enforcer', description: 'Physical player, intimidates opponents' },
    { id: 'speedster', name: 'Speedster', description: 'Exceptional skating ability' },
    { id: 'defensive', name: 'Defensive Specialist', description: 'Excellent defensive positioning' }
];

// Shot Types
const SHOT_TYPES = {
    WRIST_SHOT: { name: 'Wrist Shot', power: 1.0, accuracy: 1.2, speed: 1.0 },
    SLAP_SHOT: { name: 'Slap Shot', power: 1.5, accuracy: 0.8, speed: 1.5 },
    BACKHAND: { name: 'Backhand', power: 0.8, accuracy: 0.9, speed: 0.9 },
    SNAP_SHOT: { name: 'Snap Shot', power: 1.1, accuracy: 1.1, speed: 1.2 },
    ONE_TIMER: { name: 'One Timer', power: 1.4, accuracy: 0.7, speed: 1.6 }
};

// Injury Types
const INJURY_TYPES = [
    { name: 'Upper Body Injury', minGames: 1, maxGames: 5, severity: 'minor' },
    { name: 'Lower Body Injury', minGames: 2, maxGames: 7, severity: 'moderate' },
    { name: 'Concussion', minGames: 5, maxGames: 15, severity: 'serious' },
    { name: 'Broken Bone', minGames: 10, maxGames: 30, severity: 'major' },
    { name: 'Bruised', minGames: 0, maxGames: 1, severity: 'day-to-day' }
];

// Awards and Achievements
const AWARDS = {
    MVP: { name: 'Most Valuable Player', description: 'Best overall player in the league' },
    SCORING_LEADER: { name: 'Scoring Champion', description: 'Most points in the season' },
    ROOKIE_OF_YEAR: { name: 'Rookie of the Year', description: 'Best first-year player' },
    BEST_DEFENSEMAN: { name: 'Best Defenseman', description: 'Top defensive player' },
    ALL_STAR: { name: 'All-Star Selection', description: 'Selected to all-star team' },
    STANLEY_CUP: { name: 'Stanley Cup Champion', description: 'Won the championship' }
};

// Play Strategies
const STRATEGIES = {
    OFFENSIVE: {
        AGGRESSIVE: { name: 'Aggressive Forecheck', offense: 1.2, defense: 0.8 },
        BALANCED: { name: 'Balanced Attack', offense: 1.0, defense: 1.0 },
        CYCLE: { name: 'Cycle Game', offense: 1.1, defense: 0.9 }
    },
    DEFENSIVE: {
        TRAP: { name: 'Neutral Zone Trap', offense: 0.7, defense: 1.3 },
        DUMP_CHASE: { name: 'Dump and Chase', offense: 0.9, defense: 1.1 },
        PROTECT_LEAD: { name: 'Protect the Lead', offense: 0.6, defense: 1.4 }
    }
};

// Equipment and Gear
const EQUIPMENT = [
    { id: 'basic_stick', name: 'Basic Stick', price: 150, shooting: 0, puckControl: 0 },
    { id: 'pro_stick', name: 'Pro Stick', price: 300, shooting: 3, puckControl: 2 },
    { id: 'elite_stick', name: 'Elite Carbon Stick', price: 500, shooting: 5, puckControl: 4 },
    { id: 'basic_skates', name: 'Basic Skates', price: 200, skating: 0 },
    { id: 'pro_skates', name: 'Pro Skates', price: 400, skating: 3 },
    { id: 'elite_skates', name: 'Elite Speed Skates', price: 700, skating: 6 },
    { id: 'training_program', name: 'Personal Training', price: 1000, allSkills: 2 },
    { id: 'nutrition_plan', name: 'Nutrition Plan', price: 500, conditioning: 3, strength: 2 }
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
