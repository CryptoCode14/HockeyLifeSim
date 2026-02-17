// Complete NHL Teams - All 32 Teams with Accurate Information
const NHL_TEAMS = [
    // Atlantic Division
    { id: 1, name: 'Boston Bruins', city: 'Boston', state: 'MA', arena: 'TD Garden', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 88, colors: ['Black', 'Gold'] },
    { id: 2, name: 'Buffalo Sabres', city: 'Buffalo', state: 'NY', arena: 'KeyBank Center', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 79, colors: ['Navy', 'Gold'] },
    { id: 3, name: 'Detroit Red Wings', city: 'Detroit', state: 'MI', arena: 'Little Caesars Arena', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 80, colors: ['Red', 'White'] },
    { id: 4, name: 'Florida Panthers', city: 'Sunrise', state: 'FL', arena: 'FLA Live Arena', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 87, colors: ['Red', 'Navy'] },
    { id: 5, name: 'Montreal Canadiens', city: 'Montreal', state: 'QC', arena: 'Bell Centre', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 82, colors: ['Red', 'Blue', 'White'] },
    { id: 6, name: 'Ottawa Senators', city: 'Ottawa', state: 'ON', arena: 'Canadian Tire Centre', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 78, colors: ['Red', 'Black', 'Gold'] },
    { id: 7, name: 'Tampa Bay Lightning', city: 'Tampa', state: 'FL', arena: 'Amalie Arena', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 90, colors: ['Blue', 'White'] },
    { id: 8, name: 'Toronto Maple Leafs', city: 'Toronto', state: 'ON', arena: 'Scotiabank Arena', conference: 'Eastern', division: 'Atlantic', leagueId: 1, rating: 87, colors: ['Blue', 'White'] },
    
    // Metropolitan Division
    { id: 9, name: 'Carolina Hurricanes', city: 'Raleigh', state: 'NC', arena: 'PNC Arena', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 86, colors: ['Red', 'Black'] },
    { id: 10, name: 'Columbus Blue Jackets', city: 'Columbus', state: 'OH', arena: 'Nationwide Arena', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 77, colors: ['Navy', 'Red'] },
    { id: 11, name: 'New Jersey Devils', city: 'Newark', state: 'NJ', arena: 'Prudential Center', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 85, colors: ['Red', 'Black'] },
    { id: 12, name: 'New York Islanders', city: 'Elmont', state: 'NY', arena: 'UBS Arena', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 83, colors: ['Royal Blue', 'Orange'] },
    { id: 13, name: 'New York Rangers', city: 'New York', state: 'NY', arena: 'Madison Square Garden', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 86, colors: ['Blue', 'Red', 'White'] },
    { id: 14, name: 'Philadelphia Flyers', city: 'Philadelphia', state: 'PA', arena: 'Wells Fargo Center', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 79, colors: ['Orange', 'Black'] },
    { id: 15, name: 'Pittsburgh Penguins', city: 'Pittsburgh', state: 'PA', arena: 'PPG Paints Arena', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 84, colors: ['Black', 'Gold'] },
    { id: 16, name: 'Washington Capitals', city: 'Washington', state: 'DC', arena: 'Capital One Arena', conference: 'Eastern', division: 'Metropolitan', leagueId: 1, rating: 85, colors: ['Red', 'Navy', 'White'] },
    
    // Central Division
    { id: 17, name: 'Arizona Coyotes', city: 'Tempe', state: 'AZ', arena: 'Mullett Arena', conference: 'Western', division: 'Central', leagueId: 1, rating: 72, colors: ['Brick Red', 'Black'] },
    { id: 18, name: 'Chicago Blackhawks', city: 'Chicago', state: 'IL', arena: 'United Center', conference: 'Western', division: 'Central', leagueId: 1, rating: 76, colors: ['Red', 'Black', 'White'] },
    { id: 19, name: 'Colorado Avalanche', city: 'Denver', state: 'CO', arena: 'Ball Arena', conference: 'Western', division: 'Central', leagueId: 1, rating: 91, colors: ['Burgundy', 'Navy', 'Silver'] },
    { id: 20, name: 'Dallas Stars', city: 'Dallas', state: 'TX', arena: 'American Airlines Center', conference: 'Western', division: 'Central', leagueId: 1, rating: 87, colors: ['Green', 'Black', 'Silver'] },
    { id: 21, name: 'Minnesota Wild', city: 'St. Paul', state: 'MN', arena: 'Xcel Energy Center', conference: 'Western', division: 'Central', leagueId: 1, rating: 83, colors: ['Green', 'Red', 'Gold'] },
    { id: 22, name: 'Nashville Predators', city: 'Nashville', state: 'TN', arena: 'Bridgestone Arena', conference: 'Western', division: 'Central', leagueId: 1, rating: 81, colors: ['Navy', 'Gold'] },
    { id: 23, name: 'St. Louis Blues', city: 'St. Louis', state: 'MO', arena: 'Enterprise Center', conference: 'Western', division: 'Central', leagueId: 1, rating: 82, colors: ['Blue', 'Navy', 'Gold'] },
    { id: 24, name: 'Winnipeg Jets', city: 'Winnipeg', state: 'MB', arena: 'Canada Life Centre', conference: 'Western', division: 'Central', leagueId: 1, rating: 84, colors: ['Navy', 'Blue'] },
    
    // Pacific Division
    { id: 25, name: 'Anaheim Ducks', city: 'Anaheim', state: 'CA', arena: 'Honda Center', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 75, colors: ['Orange', 'Black', 'Gold'] },
    { id: 26, name: 'Calgary Flames', city: 'Calgary', state: 'AB', arena: 'Scotiabank Saddledome', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 84, colors: ['Red', 'Yellow', 'Black'] },
    { id: 27, name: 'Edmonton Oilers', city: 'Edmonton', state: 'AB', arena: 'Rogers Place', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 89, colors: ['Orange', 'Blue'] },
    { id: 28, name: 'Los Angeles Kings', city: 'Los Angeles', state: 'CA', arena: 'Crypto.com Arena', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 85, colors: ['Black', 'Silver', 'White'] },
    { id: 29, name: 'San Jose Sharks', city: 'San Jose', state: 'CA', arena: 'SAP Center', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 74, colors: ['Teal', 'Black', 'Orange'] },
    { id: 30, name: 'Seattle Kraken', city: 'Seattle', state: 'WA', arena: 'Climate Pledge Arena', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 82, colors: ['Deep Sea Blue', 'Ice Blue'] },
    { id: 31, name: 'Vancouver Canucks', city: 'Vancouver', state: 'BC', arena: 'Rogers Arena', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 80, colors: ['Blue', 'Green', 'Silver'] },
    { id: 32, name: 'Vegas Golden Knights', city: 'Las Vegas', state: 'NV', arena: 'T-Mobile Arena', conference: 'Western', division: 'Pacific', leagueId: 1, rating: 88, colors: ['Steel Gray', 'Gold', 'Red'] }
];

// NCAA Division I Hockey Teams - All 60 Teams
const NCAA_TEAMS = [
    // Big Ten Conference
    { id: 501, name: 'Michigan Wolverines', school: 'University of Michigan', city: 'Ann Arbor', state: 'MI', conference: 'Big Ten', arena: 'Yost Ice Arena', leagueId: 7, academicRating: 95, hockeyRating: 92, nilBudget: 500000 },
    { id: 502, name: 'Minnesota Golden Gophers', school: 'University of Minnesota', city: 'Minneapolis', state: 'MN', conference: 'Big Ten', arena: '3M Arena at Mariucci', leagueId: 7, academicRating: 88, hockeyRating: 90, nilBudget: 450000 },
    { id: 503, name: 'Wisconsin Badgers', school: 'University of Wisconsin', city: 'Madison', state: 'WI', conference: 'Big Ten', arena: 'Kohl Center', leagueId: 7, academicRating: 90, hockeyRating: 88, nilBudget: 400000 },
    { id: 504, name: 'Ohio State Buckeyes', school: 'Ohio State University', city: 'Columbus', state: 'OH', conference: 'Big Ten', arena: 'Value City Arena', leagueId: 7, academicRating: 85, hockeyRating: 82, nilBudget: 380000 },
    { id: 505, name: 'Penn State Nittany Lions', school: 'Pennsylvania State University', city: 'University Park', state: 'PA', conference: 'Big Ten', arena: 'Pegula Ice Arena', leagueId: 7, academicRating: 87, hockeyRating: 85, nilBudget: 420000 },
    { id: 506, name: 'Michigan State Spartans', school: 'Michigan State University', city: 'East Lansing', state: 'MI', conference: 'Big Ten', arena: 'Munn Ice Arena', leagueId: 7, academicRating: 82, hockeyRating: 83, nilBudget: 350000 },
    { id: 507, name: 'Notre Dame Fighting Irish', school: 'University of Notre Dame', city: 'Notre Dame', state: 'IN', conference: 'Big Ten', arena: 'Compton Family Ice Arena', leagueId: 7, academicRating: 96, hockeyRating: 87, nilBudget: 480000 },
    
    // NCHC (National Collegiate Hockey Conference)
    { id: 510, name: 'Denver Pioneers', school: 'University of Denver', city: 'Denver', state: 'CO', conference: 'NCHC', arena: 'Magness Arena', leagueId: 7, academicRating: 85, hockeyRating: 93, nilBudget: 380000 },
    { id: 511, name: 'North Dakota Fighting Hawks', school: 'University of North Dakota', city: 'Grand Forks', state: 'ND', conference: 'NCHC', arena: 'Ralph Engelstad Arena', leagueId: 7, academicRating: 75, hockeyRating: 91, nilBudget: 400000 },
    { id: 512, name: 'Minnesota Duluth Bulldogs', school: 'University of Minnesota Duluth', city: 'Duluth', state: 'MN', conference: 'NCHC', arena: 'AMSOIL Arena', leagueId: 7, academicRating: 78, hockeyRating: 89, nilBudget: 320000 },
    { id: 513, name: 'St. Cloud State Huskies', school: 'St. Cloud State University', city: 'St. Cloud', state: 'MN', conference: 'NCHC', arena: 'Herb Brooks National Hockey Center', leagueId: 7, academicRating: 72, hockeyRating: 84, nilBudget: 280000 },
    { id: 514, name: 'Omaha Mavericks', school: 'University of Nebraska Omaha', city: 'Omaha', state: 'NE', conference: 'NCHC', arena: 'Baxter Arena', leagueId: 7, academicRating: 70, hockeyRating: 80, nilBudget: 250000 },
    { id: 515, name: 'Western Michigan Broncos', school: 'Western Michigan University', city: 'Kalamazoo', state: 'MI', conference: 'NCHC', arena: 'Lawson Ice Arena', leagueId: 7, academicRating: 68, hockeyRating: 78, nilBudget: 240000 },
    { id: 516, name: 'Miami RedHawks', school: 'Miami University', city: 'Oxford', state: 'OH', conference: 'NCHC', arena: 'Steve Cady Arena', leagueId: 7, academicRating: 80, hockeyRating: 82, nilBudget: 300000 },
    { id: 517, name: 'Colorado College Tigers', school: 'Colorado College', city: 'Colorado Springs', state: 'CO', conference: 'NCHC', arena: 'Ed Robson Arena', leagueId: 7, academicRating: 88, hockeyRating: 81, nilBudget: 310000 },
    
    // Hockey East
    { id: 520, name: 'Boston College Eagles', school: 'Boston College', city: 'Chestnut Hill', state: 'MA', conference: 'Hockey East', arena: 'Conte Forum', leagueId: 7, academicRating: 94, hockeyRating: 90, nilBudget: 480000 },
    { id: 521, name: 'Boston University Terriers', school: 'Boston University', city: 'Boston', state: 'MA', conference: 'Hockey East', arena: 'Agganis Arena', leagueId: 7, academicRating: 92, hockeyRating: 89, nilBudget: 470000 },
    { id: 522, name: 'Northeastern Huskies', school: 'Northeastern University', city: 'Boston', state: 'MA', conference: 'Hockey East', arena: 'Matthews Arena', leagueId: 7, academicRating: 88, hockeyRating: 86, nilBudget: 400000 },
    { id: 523, name: 'Providence Friars', school: 'Providence College', city: 'Providence', state: 'RI', conference: 'Hockey East', arena: 'Schneider Arena', leagueId: 7, academicRating: 82, hockeyRating: 84, nilBudget: 320000 },
    { id: 524, name: 'UMass Minutemen', school: 'University of Massachusetts', city: 'Amherst', state: 'MA', conference: 'Hockey East', arena: 'Mullins Center', leagueId: 7, academicRating: 80, hockeyRating: 87, nilBudget: 350000 },
    { id: 525, name: 'UMass Lowell River Hawks', school: 'UMass Lowell', city: 'Lowell', state: 'MA', conference: 'Hockey East', arena: 'Tsongas Center', leagueId: 7, academicRating: 75, hockeyRating: 83, nilBudget: 300000 },
    { id: 526, name: 'New Hampshire Wildcats', school: 'University of New Hampshire', city: 'Durham', state: 'NH', conference: 'Hockey East', arena: 'Whittemore Center', leagueId: 7, academicRating: 78, hockeyRating: 81, nilBudget: 290000 },
    { id: 527, name: 'Maine Black Bears', school: 'University of Maine', city: 'Orono', state: 'ME', conference: 'Hockey East', arena: 'Alfond Arena', leagueId: 7, academicRating: 74, hockeyRating: 79, nilBudget: 270000 },
    { id: 528, name: 'Vermont Catamounts', school: 'University of Vermont', city: 'Burlington', state: 'VT', conference: 'Hockey East', arena: 'Gutterson Fieldhouse', leagueId: 7, academicRating: 76, hockeyRating: 77, nilBudget: 260000 },
    { id: 529, name: 'UConn Huskies', school: 'University of Connecticut', city: 'Storrs', state: 'CT', conference: 'Hockey East', arena: 'Freitas Ice Forum', leagueId: 7, academicRating: 81, hockeyRating: 80, nilBudget: 310000 },
    { id: 530, name: 'Merrimack Warriors', school: 'Merrimack College', city: 'North Andover', state: 'MA', conference: 'Hockey East', arena: 'Lawler Rink', leagueId: 7, academicRating: 72, hockeyRating: 76, nilBudget: 240000 },
    
    // ECAC Hockey
    { id: 540, name: 'Cornell Big Red', school: 'Cornell University', city: 'Ithaca', state: 'NY', conference: 'ECAC', arena: 'Lynah Rink', leagueId: 7, academicRating: 98, hockeyRating: 88, nilBudget: 450000 },
    { id: 541, name: 'Harvard Crimson', school: 'Harvard University', city: 'Cambridge', state: 'MA', conference: 'ECAC', arena: 'Bright-Landry Hockey Center', leagueId: 7, academicRating: 99, hockeyRating: 86, nilBudget: 460000 },
    { id: 542, name: 'Yale Bulldogs', school: 'Yale University', city: 'New Haven', state: 'CT', conference: 'ECAC', arena: 'Ingalls Rink', leagueId: 7, academicRating: 98, hockeyRating: 85, nilBudget: 440000 },
    { id: 543, name: 'Princeton Tigers', school: 'Princeton University', city: 'Princeton', state: 'NJ', conference: 'ECAC', arena: 'Hobey Baker Memorial Rink', leagueId: 7, academicRating: 98, hockeyRating: 82, nilBudget: 420000 },
    { id: 544, name: 'Dartmouth Big Green', school: 'Dartmouth College', city: 'Hanover', state: 'NH', conference: 'ECAC', arena: 'Thompson Arena', leagueId: 7, academicRating: 96, hockeyRating: 80, nilBudget: 400000 },
    { id: 545, name: 'Clarkson Golden Knights', school: 'Clarkson University', city: 'Potsdam', state: 'NY', conference: 'ECAC', arena: 'Cheel Arena', leagueId: 7, academicRating: 83, hockeyRating: 84, nilBudget: 310000 },
    { id: 546, name: 'Quinnipiac Bobcats', school: 'Quinnipiac University', city: 'Hamden', state: 'CT', conference: 'ECAC', arena: 'M&T Bank Arena', leagueId: 7, academicRating: 80, hockeyRating: 87, nilBudget: 340000 },
    { id: 547, name: 'RPI Engineers', school: 'Rensselaer Polytechnic Institute', city: 'Troy', state: 'NY', conference: 'ECAC', arena: 'Houston Field House', leagueId: 7, academicRating: 91, hockeyRating: 79, nilBudget: 320000 },
    { id: 548, name: 'Union Dutchmen', school: 'Union College', city: 'Schenectady', state: 'NY', conference: 'ECAC', arena: 'Messa Rink at Achilles Center', leagueId: 7, academicRating: 85, hockeyRating: 81, nilBudget: 300000 },
    { id: 549, name: 'Brown Bears', school: 'Brown University', city: 'Providence', state: 'RI', conference: 'ECAC', arena: 'Meehan Auditorium', leagueId: 7, academicRating: 97, hockeyRating: 78, nilBudget: 380000 },
    { id: 550, name: 'Colgate Raiders', school: 'Colgate University', city: 'Hamilton', state: 'NY', conference: 'ECAC', arena: 'Class of 1965 Arena', leagueId: 7, academicRating: 88, hockeyRating: 83, nilBudget: 330000 },
    { id: 551, name: 'St. Lawrence Saints', school: 'St. Lawrence University', city: 'Canton', state: 'NY', conference: 'ECAC', arena: 'Appleton Arena', leagueId: 7, academicRating: 82, hockeyRating: 77, nilBudget: 280000 }
];

// Additional configuration
const NHL_DRAFT_ROUNDS = 7;
const NHL_DRAFT_PICKS_PER_ROUND = 32;
const NHL_DRAFT_TOTAL_PICKS = NHL_DRAFT_ROUNDS * NHL_DRAFT_PICKS_PER_ROUND;
