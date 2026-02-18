// Realistic Player Name Generation and Rosters
// Based on actual hockey player demographics and naming patterns

// First Names - Hockey Player Demographics (North American + International)
const FIRST_NAMES = {
    northAmerican: [
        'Connor', 'Dylan', 'Tyler', 'Jake', 'Ryan', 'Jack', 'Cole', 'Carter', 'Owen', 'Austin',
        'Brandon', 'Jordan', 'Alex', 'Matt', 'Nick', 'Kyle', 'Ben', 'Luke', 'Sam', 'Max',
        'Nathan', 'Evan', 'Logan', 'Blake', 'Mason', 'Chase', 'Brady', 'Garrett', 'Trevor', 'Hunter',
        'Justin', 'Zach', 'Sean', 'Drew', 'Colin', 'Brett', 'Devon', 'Riley', 'Casey', 'Dakota',
        'Andrew', 'Michael', 'David', 'Daniel', 'Jason', 'Kevin', 'Eric', 'Adam', 'Scott', 'Mark',
        'Patrick', 'William', 'Thomas', 'James', 'John', 'Robert', 'Brayden', 'Jayden', 'Kaden', 'Aiden',
        'Colton', 'Dalton', 'Parker', 'Tucker', 'Spencer', 'Devin', 'Landon', 'Taylor', 'Shane', 'Travis'
    ],
    canadian: [
        'Connor', 'Dylan', 'Carter', 'Brayden', 'Ethan', 'Owen', 'Nathan', 'Logan', 'Jacob', 'Ryan',
        'Liam', 'Noah', 'Mason', 'Lucas', 'Gavin', 'Evan', 'Cole', 'Tyler', 'Hunter', 'Chase',
        'Wyatt', 'Caleb', 'Nolan', 'Mitchell', 'Travis', 'Quinn', 'Drew', 'Cameron', 'Dustin', 'Morgan'
    ],
    scandinavian: [
        'William', 'Elias', 'Filip', 'Anton', 'Oliver', 'Lucas', 'Viktor', 'Gustav', 'Oscar', 'Marcus',
        'Alexander', 'Sebastian', 'Ludvig', 'Emil', 'Rasmus', 'Linus', 'Jonathan', 'Nicklas', 'Jesper', 'Patrik',
        'Henrik', 'Mattias', 'Mikael', 'Robin', 'Simon', 'Tobias', 'Daniel', 'Niklas', 'Anders', 'Erik'
    ],
    russian: [
        'Alexander', 'Dmitry', 'Nikita', 'Artem', 'Ivan', 'Mikhail', 'Andrei', 'Vladimir', 'Ilya', 'Pavel',
        'Kirill', 'Alexei', 'Sergei', 'Maxim', 'Roman', 'Igor', 'Evgeny', 'Nikolai', 'Anton', 'Vitaly'
    ],
    czech: [
        'Jakub', 'Jan', 'Tomáš', 'Martin', 'Lukáš', 'David', 'Ondřej', 'Petr', 'Filip', 'Michal',
        'Matěj', 'Vojtěch', 'Daniel', 'Adam', 'Dominik', 'Marek', 'Pavel', 'Radek', 'Josef', 'Jiří'
    ]
};

// Last Names by Region
const LAST_NAMES = {
    canadian: [
        'Smith', 'MacDonald', 'Johnson', 'Brown', 'Wilson', 'Campbell', 'Anderson', 'Taylor', 'Martin', 'Thompson',
        'Murphy', 'O\'Brien', 'Kennedy', 'Stewart', 'Murray', 'Clark', 'Ross', 'Reid', 'Young', 'Mitchell',
        'Robertson', 'Graham', 'Fraser', 'Hamilton', 'Scott', 'Morrison', 'Cameron', 'Ferguson', 'Patterson', 'Henderson',
        'McKenzie', 'MacLeod', 'MacKay', 'MacLean', 'Davidson', 'Johnston', 'Bell', 'Sullivan', 'Simpson', 'Gibson',
        'Roy', 'Bouchard', 'Gagnon', 'Côté', 'Leblanc', 'Tremblay', 'Bergeron', 'Lavoie', 'Fortin', 'Morin'
    ],
    american: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
        'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young',
        'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill',
        'Mitchell', 'Campbell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Parker', 'Edwards', 'Collins'
    ],
    scandinavian: [
        'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson',
        'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson', 'Jönsson', 'Lindberg', 'Jakobsson', 'Magnusson', 'Olofsson',
        'Lindström', 'Lundqvist', 'Bergström', 'Sjöberg', 'Hedman', 'Forsberg', 'Ekman', 'Lundin', 'Sundqvist', 'Nyström',
        'Hansen', 'Andersen', 'Nielsen', 'Jensen', 'Petersen', 'Larsen', 'Christensen', 'Sørensen', 'Rasmussen', 'Møller'
    ],
    russian: [
        'Ivanov', 'Petrov', 'Sidorov', 'Kuznetsov', 'Popov', 'Volkov', 'Vasiliev', 'Sokolov', 'Mikhailov', 'Fedorov',
        'Morozov', 'Novikov', 'Kozlov', 'Orlov', 'Smirnov', 'Andreev', 'Romanov', 'Pavlov', 'Alexeev', 'Kiselev',
        'Kovalev', 'Dmitriev', 'Makarov', 'Zhukov', 'Grigoriev', 'Egorov', 'Lebedev', 'Tarasov', 'Belov', 'Konstantinov'
    ],
    czech: [
        'Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec',
        'Pospíšil', 'Marek', 'Pokorný', 'Hájek', 'Jelínek', 'Král', 'Beneš', 'Fiala', 'Sedláček', 'Urban',
        'Holub', 'Krejčí', 'Moravec', 'Vaněk', 'Šimek', 'Čech', 'Kopecký', 'Zeman', 'Vondra', 'Rybář'
    ],
    other: [
        'Kane', 'Keith', 'Toews', 'Crosby', 'Ovechkin', 'Malkin', 'McDavid', 'Matthews', 'Marner', 'Tavares'
    ]
};

// Player Positions
const POSITIONS = ['C', 'LW', 'RW', 'LD', 'RD', 'G'];
const FORWARD_POSITIONS = ['C', 'LW', 'RW'];
const DEFENSE_POSITIONS = ['LD', 'RD'];

// Generate a realistic player name with regional authenticity
function generateRealisticName(region = null) {
    if (!region) {
        // Random region weighted toward North American
        const regions = ['northAmerican', 'canadian', 'scandinavian', 'russian', 'czech'];
        const weights = [40, 30, 15, 10, 5]; // Percentages
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (let i = 0; i < regions.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                region = regions[i];
                break;
            }
        }
    }
    
    const firstNames = FIRST_NAMES[region] || FIRST_NAMES.northAmerican;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    
    let lastNameRegion = region;
    if (region === 'northAmerican') lastNameRegion = Math.random() < 0.5 ? 'american' : 'canadian';
    
    const lastNames = LAST_NAMES[lastNameRegion] || LAST_NAMES.american;
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return { firstName, lastName, fullName: `${firstName} ${lastName}`, region };
}

// Generate a complete player with realistic attributes
function generatePlayer(position, ageRange = {min: 18, max: 25}, overallRange = {min: 65, max: 85}) {
    const name = generateRealisticName();
    const age = Math.floor(Math.random() * (ageRange.max - ageRange.min + 1)) + ageRange.min;
    const overall = Math.floor(Math.random() * (overallRange.max - overallRange.min + 1)) + overallRange.min;
    
    // Potential based on age (younger = higher potential ceiling)
    const potentialBonus = Math.max(0, (25 - age) * 2);
    const potential = Math.min(99, overall + Math.floor(Math.random() * potentialBonus));
    
    return {
        ...name,
        position,
        age,
        overall,
        potential,
        jerseyNumber: Math.floor(Math.random() * 99) + 1,
        handedness: Math.random() < 0.7 ? 'L' : 'R', // 70% left-handed in hockey
        height: generateHeight(position),
        weight: generateWeight(position),
        draftYear: age >= 18 ? new Date().getFullYear() - (age - 18) : null,
        draftRound: age >= 18 ? Math.floor(Math.random() * 7) + 1 : null,
        draftPick: age >= 18 ? Math.floor(Math.random() * 31) + 1 : null
    };
}

function generateHeight(position) {
    // Height in inches
    if (position === 'G') {
        return Math.floor(Math.random() * 4) + 72; // 6'0" - 6'3"
    } else if (DEFENSE_POSITIONS.includes(position)) {
        return Math.floor(Math.random() * 5) + 71; // 5'11" - 6'3"
    } else {
        return Math.floor(Math.random() * 6) + 69; // 5'9" - 6'2"
    }
}

function generateWeight(position) {
    // Weight in pounds
    if (position === 'G') {
        return Math.floor(Math.random() * 30) + 180; // 180-210 lbs
    } else if (DEFENSE_POSITIONS.includes(position)) {
        return Math.floor(Math.random() * 35) + 190; // 190-225 lbs
    } else {
        return Math.floor(Math.random() * 40) + 170; // 170-210 lbs
    }
}

// Generate a full team roster
function generateTeamRoster(teamName, league = 'NHL', includeProspects = false) {
    const roster = [];
    
    if (league === 'NHL') {
        // NHL roster: 12 forwards, 6 defense, 2 goalies
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('C', {min: 20, max: 35}, {min: 75, max: 92}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('LW', {min: 20, max: 35}, {min: 75, max: 92}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('RW', {min: 20, max: 35}, {min: 75, max: 92}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('LD', {min: 21, max: 36}, {min: 75, max: 90}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('RD', {min: 21, max: 36}, {min: 75, max: 90}));
        roster.push(generatePlayer('G', {min: 23, max: 37}, {min: 80, max: 93}));
        roster.push(generatePlayer('G', {min: 22, max: 32}, {min: 72, max: 85}));
    } else if (league === 'NCAA') {
        // NCAA roster: 13 forwards, 8 defense, 3 goalies
        for (let i = 0; i < 5; i++) roster.push(generatePlayer('C', {min: 18, max: 23}, {min: 60, max: 80}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('LW', {min: 18, max: 23}, {min: 60, max: 80}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('RW', {min: 18, max: 23}, {min: 60, max: 80}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('LD', {min: 18, max: 23}, {min: 60, max: 78}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('RD', {min: 18, max: 23}, {min: 60, max: 78}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('G', {min: 18, max: 23}, {min: 62, max: 80}));
    } else if (league === 'Junior') {
        // Junior roster: 12 forwards, 6 defense, 2 goalies
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('C', {min: 16, max: 20}, {min: 55, max: 78}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('LW', {min: 16, max: 20}, {min: 55, max: 78}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('RW', {min: 16, max: 20}, {min: 55, max: 78}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('LD', {min: 16, max: 20}, {min: 55, max: 75}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('RD', {min: 16, max: 20}, {min: 55, max: 75}));
        for (let i = 0; i < 2; i++) roster.push(generatePlayer('G', {min: 16, max: 20}, {min: 58, max: 78}));
    } else if (league === 'HighSchool') {
        // High school roster: 10 forwards, 6 defense, 2 goalies
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('C', {min: 14, max: 18}, {min: 45, max: 68}));
        for (let i = 0; i < 4; i++) roster.push(generatePlayer('LW', {min: 14, max: 18}, {min: 45, max: 68}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('RW', {min: 14, max: 18}, {min: 45, max: 68}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('LD', {min: 14, max: 18}, {min: 45, max: 65}));
        for (let i = 0; i < 3; i++) roster.push(generatePlayer('RD', {min: 14, max: 18}, {min: 45, max: 65}));
        for (let i = 0; i < 2; i++) roster.push(generatePlayer('G', {min: 14, max: 18}, {min: 48, max: 70}));
    }
    
    return roster;
}
