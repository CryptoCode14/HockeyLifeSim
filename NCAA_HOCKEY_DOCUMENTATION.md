# Hockey Life Sim - NCAA Division I Hockey System

## Overview

This implementation adds a complete and realistic NCAA Division I hockey system to Hockey Life Sim, featuring all 60 teams across 7 conferences, authentic scheduling, and comprehensive ranking systems.

## Features Implemented

### 1. NCAA Division I Teams (60 Teams)

**Big Ten Conference (7 teams)**
- University of Michigan (Yost Ice Arena)
- University of Minnesota (3M Arena at Mariucci)
- University of Wisconsin (Kohl Center)
- Ohio State University (Value City Arena)
- Pennsylvania State University (Pegula Ice Arena)
- Michigan State University (Munn Ice Arena)
- University of Notre Dame (Compton Family Ice Arena)

**NCHC - National Collegiate Hockey Conference (8 teams)**
- University of Denver (Magness Arena) - 9 National Championships
- University of North Dakota (Ralph Engelstad Arena) - 8 National Championships
- University of Minnesota Duluth (AMSOIL Arena)
- St. Cloud State University (Herb Brooks National Hockey Center)
- University of Nebraska Omaha (Baxter Arena)
- Western Michigan University (Lawson Ice Arena)
- Miami University (Steve Cady Arena)
- Colorado College (Ed Robson Arena)

**Hockey East (11 teams)**
- Boston College (Conte Forum) - 5 National Championships
- Boston University (Agganis Arena) - 5 National Championships
- Northeastern University (Matthews Arena)
- Providence College (Schneider Arena)
- University of Massachusetts (Mullins Center)
- UMass Lowell (Tsongas Center)
- University of New Hampshire (Whittemore Center)
- University of Maine (Alfond Arena)
- University of Vermont (Gutterson Fieldhouse)
- University of Connecticut (Freitas Ice Forum)
- Merrimack College (Lawler Rink)

**ECAC Hockey (12 teams)**
- Cornell University (Lynah Rink) - "Lynah Faithful"
- Harvard University (Bright-Landry Hockey Center) - Ivy League Excellence
- Yale University (Ingalls Rink) - "The Whale"
- Princeton University (Hobey Baker Memorial Rink)
- Dartmouth College (Thompson Arena)
- Clarkson University (Cheel Arena)
- Quinnipiac University (M&T Bank Arena)
- Rensselaer Polytechnic Institute (Houston Field House)
- Union College (Messa Rink at Achilles Center)
- Brown University (Meehan Auditorium)
- Colgate University (Class of 1965 Arena)
- St. Lawrence University (Appleton Arena)

**Atlantic Hockey (10 teams)**
- United States Air Force Academy (Cadet Ice Arena)
- United States Military Academy (Tate Rink)
- Canisius College (LECOM Harborcenter)
- College of the Holy Cross (Hart Center)
- Niagara University (Dwyer Arena)
- Rochester Institute of Technology (Gene Polisseni Center)
- Sacred Heart University (Martire Family Arena)
- Bentley University (Bentley Arena)
- Mercyhurst University (Mercyhurst Ice Center)
- American International College (MassMutual Center)

**CCHA - Central Collegiate Hockey Association (7 teams)**
- Bowling Green State University (Slater Family Ice Arena)
- Ferris State University (Ewigleben Sports Complex)
- Lake Superior State University (Taffy Abel Arena)
- Michigan Technological University (John MacInnes Student Ice Arena)
- Minnesota State University (Mayo Clinic Health System Event Center)
- Northern Michigan University (Berry Events Center)
- Bemidji State University (Sanford Center)

**Independent Teams (6 teams)**
- Arizona State University (Mullett Arena)
- University of Alaska Fairbanks (Carlson Center)
- University of Alaska Anchorage (Wells Fargo Sports Complex)
- Long Island University (Northwell Health Ice Center)
- Lindenwood University (Lindenwood Ice Arena)
- Stonehill College (Bridgewater Ice Arena)

### 2. Realistic NCAA Schedule Generation

**Season Structure:**
- Season runs October through March
- 34-36 total regular season games
- Weekend series format (Friday/Saturday games)
- Mix of conference and non-conference opponents

**Phase Breakdown:**
1. **October (4-6 games)**: Early non-conference games to start the season
2. **November-December (12-14 games)**: Mix of conference (70%) and non-conference games
3. **Holiday Tournaments**: 50% chance to participate in tournaments like:
   - Beanpot Tournament (Boston teams)
   - Great Lakes Invitational (Michigan)
   - Mariucci Classic (Minnesota)
   - Various Holiday Classics
4. **January-February (14-16 games)**: Heavy conference play
5. **March (2-4 games)**: Final regular season games through March 10
6. **Mid-March**: Conference tournaments (quarter-finals, semi-finals, finals)

### 3. USCHO Top 25 Poll

**Ranking Algorithm:**
- Win percentage (weighted by strength)
- RPI (Rating Percentage Index)
- Recent performance (win/loss streaks)
- Conference quality bonus
- Historic program prestige

**Display Features:**
- Rank (1-25)
- Movement indicators (↑ up, ↓ down, — no change, NR new entry)
- School name
- Conference
- Record (Wins-Losses-Ties)
- Poll points (25 for #1, down to 1 for #25)

### 4. PairWise Rankings (PWR)

**PWR Calculation:**
Uses three criteria for head-to-head team comparisons:
1. Head-to-head record (if teams have played)
2. RPI comparison
3. Record against common opponents

Team A wins a comparison if they win 2 or more of the 3 criteria.

**RPI Formula:**
- RPI = (WP × 0.25) + (OWP × 0.50) + (OOWP × 0.25)
- WP = Winning Percentage
- OWP = Opponent Winning Percentage  
- OOWP = Opponent's Opponent Winning Percentage

**NCAA Tournament Selection:**
- Top 16 teams in PairWise Rankings qualify for NCAA tournament
- 6 automatic bids (conference tournament champions)
- 10 at-large bids based on PWR

### 5. Conference Standings

**Standings Tracking:**
- Conference record (wins-losses-ties)
- Overall record
- Conference points (2 for win, 1 for tie/OT loss)
- Goals for (GF)
- Goals against (GA)

**Tiebreakers:**
1. Conference points
2. Conference wins
3. Goal differential

### 6. School Traditions & Rivalries

**Notable Traditions:**
- Michigan: "It's all your fault!" Yost chant, fish throwing after goals
- Minnesota: "The Rouser" fight song, Gold Country student section
- Wisconsin: "Jump Around" between periods, Sieve chant
- Boston College: Superfan with eagle costume, "For Boston" chant
- Boston University: Dog Pound student section, Battle of Comm Ave rivalry
- Denver: Pioneer scarf tradition, most championships (9)
- North Dakota: Ralph Engelstad Arena ($100+ million facility)
- Cornell: Lynah Faithful (most intimidating fans), fish throwing tradition
- Harvard: Crimson Crazies, Ivy League academic excellence

**Major Rivalries:**
- Michigan vs Wisconsin (Great Lakes rivalry)
- Michigan vs Michigan State (in-state rivalry)
- Minnesota vs Wisconsin (Border Battle)
- Minnesota vs Minnesota Duluth (state rivalry)
- Boston College vs Boston University (Battle of Comm Ave)
- Cornell vs Harvard (Ivy League rivalry)
- Denver vs North Dakota (NCHC rivalry)

## Technical Implementation

### File Structure

```
ncaa-hockey-system.js       - Schedule generation and tournament system
ncaa-rankings-system.js     - USCHO Top 25 and PairWise calculations
leagues-comprehensive.js    - All 60 NCAA team definitions
game-manager.js            - Integration with game system
app.js                     - UI handlers and display functions
index.html                 - College Rankings tab UI
styles.css                 - Rankings table and tab styling
data.js                    - Helper functions for NCAA teams
```

### Key Classes

**NCAAHockeySystem**
- `generateSchedule(playerTeamId, currentDate)` - Creates realistic season schedule
- `createGame(date, opponent, isHome, gameType, isPlayoff)` - Game object creator
- `getHolidayTournament(teamId)` - Returns appropriate tournament for team
- `addConferenceTournament(schedule, conference, currentDate)` - Adds playoff games

**NCAAHockeyRankings**
- `calculateRPI(teams)` - Computes RPI for all teams
- `calculatePairwise(teams)` - Generates PairWise Rankings
- `generateUSCHOPoll(teams)` - Creates Top 25 poll
- `updateConferenceStandings(teams)` - Updates all conference standings
- `selectNCAAField(teams)` - Selects 16-team tournament field

### Integration Points

**Game Manager (`game-manager.js`)**
```javascript
generateSchedule() {
    // Check if NCAA (leagueId 7)
    if (this.player.leagueId === 7) {
        const ncaaSystem = new NCAAHockeySystem();
        this.seasonSchedule = ncaaSystem.generateSchedule(
            this.player.teamId, 
            this.currentDate
        );
        return;
    }
    // ... other league logic
}
```

**Data Helpers (`data.js`)**
```javascript
function getTeamsForLeague(leagueId) {
    if (leagueId === 7) return NCAA_TEAMS;
    return TEAMS.filter(team => team.leagueId === leagueId);
}

function getTeamById(teamId) {
    if (teamId >= 501) {
        const ncaaTeam = NCAA_TEAMS.find(team => team.id === teamId);
        if (ncaaTeam) return ncaaTeam;
    }
    return TEAMS.find(team => team.id === teamId);
}
```

## UI Components

### College Rankings Tab

Located in `index.html`, the College Rankings tab has three sub-tabs:

1. **USCHO Top 25**
   - Current poll rankings
   - Movement indicators
   - Team records and points

2. **PairWise Rankings**
   - PWR rank (critical for tournament selection)
   - RPI values
   - PWR comparison wins

3. **Conference Standings**
   - Dropdown to select conference
   - Conference and overall records
   - Points, goals for, goals against

### Styling

All rankings components use consistent styling:
- Primary color theme (#2563eb blue)
- Hover effects on table rows
- Active tab indicators
- Responsive table design
- Clean, modern aesthetic

## Future Enhancements

### Planned Features (Not Yet Implemented)

1. **NCAA Tournament Bracket**
   - 16-team single elimination
   - 4 regionals (East, West, Midwest, Northeast)
   - Frozen Four semi-finals
   - National Championship game

2. **Player Development**
   - Academic requirements and eligibility
   - Playing time impact on development
   - NCAA vs CHL development paths

3. **Recruiting System**
   - College commitment process
   - Recruiting rankings
   - Official visit system

4. **Hobey Baker Award**
   - Track Hobey Baker candidates
   - Award voting and ceremony

5. **Transfer Portal**
   - Mid-season transfers
   - Eligibility rules
   - Impact on team chemistry

6. **Coaching Staff**
   - Head coach attributes
   - Assistant coach specializations
   - Coaching changes and impact

7. **Conference Tournament Details**
   - Seeding based on standings
   - Tournament sites and formats
   - Conference champion tracking

## Testing Recommendations

1. **Schedule Generation**
   - Test all 7 conferences
   - Verify weekend series format
   - Check holiday tournament logic
   - Validate conference tournament dates

2. **Rankings Calculation**
   - Verify RPI formula accuracy
   - Test PairWise comparisons
   - Check USCHO poll algorithm
   - Validate conference standings math

3. **UI Functionality**
   - Test tab switching
   - Verify conference selector
   - Check table rendering
   - Validate responsive design

4. **Save/Load**
   - Test NCAA career saves
   - Verify schedule persistence
   - Check rankings state

## Known Limitations

1. **Opponent Win Percentage**: Currently simplified due to lack of full season simulation
2. **Head-to-Head Records**: Not tracked across full season yet
3. **Common Opponents**: Simplified calculation
4. **Tournament Brackets**: Not fully implemented
5. **Live Rankings Updates**: Rankings don't update automatically after simulated games yet

## Credits

This implementation is based on real NCAA Division I hockey:
- Conference structures from NCAA.com
- Team information from USCHO.com
- Arena details from official school athletics sites
- RPI and PairWise formulas from NCAA official documentation
- Historic championship data from NCAA records

## License

Part of Hockey Life Sim project.
