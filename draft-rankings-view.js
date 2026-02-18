// Draft Rankings View System
// Dynamic rankings that update based on performance, injuries, and season progression

class DraftRankingsView {
    constructor(draftYear) {
        this.draftYear = draftYear;
        this.rankings = [];
        this.userPlayer = null;
        this.lastUpdate = new Date();
        this.rankingHistory = {}; // Track ranking changes over time
    }

    // Initialize rankings from draft class
    initializeRankings(draftClass, userPlayer = null) {
        this.rankings = draftClass.map((prospect, index) => ({
            ...prospect,
            currentRank: prospect.ranking || (index + 1),
            previousRank: prospect.ranking || (index + 1),
            rankChange: 0,
            stats: {
                gp: prospect.gp || 0,
                goals: prospect.goals || 0,
                assists: prospect.assists || 0,
                points: prospect.points || 0,
                pim: prospect.pim || 0
            },
            form: 'stable', // hot, cold, stable
            injuries: [],
            scoutingGrade: this.calculateScoutingGrade(prospect),
            momentum: 0 // -10 to +10
        }));

        if (userPlayer && userPlayer.draftEligibilityYear === this.draftYear) {
            this.userPlayer = this.addUserToRankings(userPlayer);
        }

        this.sortRankings();
    }

    // Add user's player to the rankings
    addUserToRankings(player) {
        const userProspect = {
            firstName: player.firstName,
            lastName: player.lastName,
            fullName: player.fullName,
            position: player.position || 'C',
            league: player.currentLeague,
            team: player.teamName,
            birthplace: player.birthplace || 'Unknown',
            overall: this.calculateOverall(player),
            potential: this.calculatePotential(player),
            currentRank: 51, // Start unranked
            previousRank: 51,
            rankChange: 0,
            stats: {
                gp: player.gamesPlayed || 0,
                goals: player.goals || 0,
                assists: player.assists || 0,
                points: player.points || 0,
                pim: player.pim || 0
            },
            form: 'stable',
            injuries: player.injuryStatus ? [player.injuryStatus] : [],
            scoutingGrade: this.calculateUserScoutingGrade(player),
            momentum: 0,
            isUser: true
        };

        this.rankings.push(userProspect);
        return userProspect;
    }

    // Update rankings based on game performance
    updateAfterGame(player, gameStats) {
        const prospect = this.findProspect(player.firstName, player.lastName);
        if (!prospect) return;

        // Update stats
        prospect.stats.gp += 1;
        prospect.stats.goals += gameStats.goals || 0;
        prospect.stats.assists += gameStats.assists || 0;
        prospect.stats.points += gameStats.points || 0;
        prospect.stats.pim += gameStats.pim || 0;

        // Calculate performance impact
        const performanceImpact = this.calculatePerformanceImpact(gameStats, prospect.position);
        prospect.momentum += performanceImpact;
        prospect.momentum = Math.max(-10, Math.min(10, prospect.momentum)); // Clamp to -10/+10

        // Determine form
        if (prospect.momentum >= 5) prospect.form = 'hot';
        else if (prospect.momentum <= -5) prospect.form = 'cold';
        else prospect.form = 'stable';

        // Update scouting grade
        prospect.scoutingGrade = this.calculateScoutingGrade(prospect);

        // Resort rankings
        this.sortRankings();
        this.updateRankChanges();
    }

    // Update ranking when player gets injured
    updateInjury(player, injury) {
        const prospect = this.findProspect(player.firstName, player.lastName);
        if (!prospect) return;

        prospect.injuries.push(injury);
        
        // Injuries hurt draft stock
        let injuryImpact = 0;
        if (injury.severity === 'major') injuryImpact = -8;
        else if (injury.severity === 'serious') injuryImpact = -5;
        else if (injury.severity === 'moderate') injuryImpact = -3;
        else if (injury.severity === 'minor') injuryImpact = -1;
        
        prospect.momentum += injuryImpact;
        prospect.form = 'cold';

        this.sortRankings();
        this.updateRankChanges();
    }

    // Calculate performance impact on rankings
    calculatePerformanceImpact(gameStats, position) {
        let impact = 0;

        if (position === 'G') {
            // Goalies: wins and save percentage matter most
            if (gameStats.win) impact += 2;
            if (gameStats.shutout) impact += 3;
            if (gameStats.savePercentage >= 0.95) impact += 2;
            else if (gameStats.savePercentage <= 0.85) impact -= 2;
        } else {
            // Skaters: points matter most
            impact += (gameStats.goals || 0) * 1.5;
            impact += (gameStats.assists || 0) * 1.0;
            impact += (gameStats.gameWinner ? 1 : 0);
            impact += (gameStats.hatTrick ? 2 : 0);

            // Plus/minus
            if (gameStats.plusMinus >= 2) impact += 0.5;
            else if (gameStats.plusMinus <= -2) impact -= 0.5;
        }

        // Penalties hurt
        if (gameStats.pim >= 4) impact -= 1;

        return Math.round(impact);
    }

    // Sort rankings by scouting score
    sortRankings() {
        this.rankings.sort((a, b) => {
            const scoreA = this.calculateRankingScore(a);
            const scoreB = this.calculateRankingScore(b);
            return scoreB - scoreA; // Higher score = better ranking
        });

        // Update current ranks
        this.rankings.forEach((prospect, index) => {
            prospect.currentRank = index + 1;
        });
    }

    // Calculate ranking score (determines draft position)
    calculateRankingScore(prospect) {
        let score = 0;

        // Base on overall and potential
        score += prospect.overall * 10;
        score += prospect.potential * 5;

        // Performance bonus (points per game)
        const ppg = prospect.stats.gp > 0 ? prospect.stats.points / prospect.stats.gp : 0;
        score += ppg * 100;

        // Momentum modifier
        score += prospect.momentum * 10;

        // Injury penalty
        const activeInjuries = prospect.injuries.filter(inj => inj.gamesRemaining > 0).length;
        score -= activeInjuries * 50;

        // Form modifier
        if (prospect.form === 'hot') score += 25;
        else if (prospect.form === 'cold') score -= 25;

        return score;
    }

    // Update rank changes
    updateRankChanges() {
        this.rankings.forEach(prospect => {
            prospect.rankChange = prospect.previousRank - prospect.currentRank;
            prospect.previousRank = prospect.currentRank;
        });

        // Track in history
        const date = new Date().toISOString().split('T')[0];
        this.rankingHistory[date] = this.rankings.map(p => ({
            name: p.fullName || `${p.firstName} ${p.lastName}`,
            rank: p.currentRank
        }));
    }

    // Calculate scouting grade (A+, A, B+, B, C+, C, D)
    calculateScoutingGrade(prospect) {
        const score = this.calculateRankingScore(prospect);
        
        if (score >= 1000) return 'A+';
        if (score >= 900) return 'A';
        if (score >= 800) return 'A-';
        if (score >= 700) return 'B+';
        if (score >= 600) return 'B';
        if (score >= 500) return 'B-';
        if (score >= 400) return 'C+';
        if (score >= 300) return 'C';
        return 'D';
    }

    calculateUserScoutingGrade(player) {
        // For user player, calculate based on actual skills
        const avgSkill = Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.keys(player.skills).length;
        const ppg = player.gamesPlayed > 0 ? player.points / player.gamesPlayed : 0;
        
        const score = avgSkill * 10 + ppg * 100 + player.reputation + player.confidence;
        
        if (score >= 1000) return 'A+';
        if (score >= 900) return 'A';
        if (score >= 800) return 'A-';
        if (score >= 700) return 'B+';
        if (score >= 600) return 'B';
        if (score >= 500) return 'B-';
        if (score >= 400) return 'C+';
        if (score >= 300) return 'C';
        return 'D';
    }

    calculateOverall(player) {
        const avgSkill = Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.keys(player.skills).length;
        return Math.floor(avgSkill);
    }

    calculatePotential(player) {
        const overall = this.calculateOverall(player);
        const age = player.age;
        const potentialBonus = Math.max(0, (20 - age) * 3);
        return Math.min(99, overall + potentialBonus + Math.floor(Math.random() * 10));
    }

    // Find prospect in rankings
    findProspect(firstName, lastName) {
        return this.rankings.find(p => 
            p.firstName.toLowerCase() === firstName.toLowerCase() && 
            p.lastName.toLowerCase() === lastName.toLowerCase()
        );
    }

    // Get top N prospects
    getTopProspects(count = 50) {
        return this.rankings.slice(0, count);
    }

    // Get user's ranking
    getUserRanking() {
        if (!this.userPlayer) return null;
        return this.rankings.find(p => p.isUser);
    }

    // Get prospects by tier
    getProspectsByTier() {
        return {
            elite: this.rankings.filter(p => p.currentRank <= 10),
            firstRound: this.rankings.filter(p => p.currentRank > 10 && p.currentRank <= 31),
            secondRound: this.rankings.filter(p => p.currentRank > 31 && p.currentRank <= 62),
            thirdRound: this.rankings.filter(p => p.currentRank > 62 && p.currentRank <= 93),
            midRound: this.rankings.filter(p => p.currentRank > 93 && p.currentRank <= 155),
            lateRound: this.rankings.filter(p => p.currentRank > 155)
        };
    }

    // Get ranking history for a prospect
    getProspectHistory(firstName, lastName) {
        const history = [];
        for (const date in this.rankingHistory) {
            const dayRankings = this.rankingHistory[date];
            const prospect = dayRankings.find(p => 
                p.name.toLowerCase().includes(firstName.toLowerCase()) && 
                p.name.toLowerCase().includes(lastName.toLowerCase())
            );
            if (prospect) {
                history.push({ date, rank: prospect.rank });
            }
        }
        return history;
    }

    // Filter rankings by position
    filterByPosition(position) {
        return this.rankings.filter(p => p.position === position);
    }

    // Filter rankings by league
    filterByLeague(league) {
        return this.rankings.filter(p => p.league === league);
    }

    // Get risers (biggest positive rank changes)
    getRisers(count = 10) {
        return [...this.rankings]
            .filter(p => p.rankChange > 0)
            .sort((a, b) => b.rankChange - a.rankChange)
            .slice(0, count);
    }

    // Get fallers (biggest negative rank changes)
    getFallers(count = 10) {
        return [...this.rankings]
            .filter(p => p.rankChange < 0)
            .sort((a, b) => a.rankChange - b.rankChange)
            .slice(0, count);
    }

    // Export rankings as text
    exportRankings() {
        let text = `${this.draftYear} NHL Draft Rankings\n`;
        text += `Updated: ${new Date().toLocaleDateString()}\n\n`;
        text += `Rank  Change  Name                    Pos  Team                  League  GP   G   A  PTS  Grade\n`;
        text += `----  ------  ----------------------  ---  --------------------  ------  ---  --  --  ---  -----\n`;
        
        this.rankings.slice(0, 50).forEach(p => {
            const change = p.rankChange > 0 ? `+${p.rankChange}` : p.rankChange === 0 ? '--' : `${p.rankChange}`;
            const name = `${p.firstName} ${p.lastName}`.padEnd(22);
            const pos = p.position.padEnd(3);
            const team = (p.team || 'Unknown').substring(0, 20).padEnd(20);
            const league = p.league.padEnd(6);
            const gp = p.stats.gp.toString().padStart(3);
            const g = p.stats.goals.toString().padStart(2);
            const a = p.stats.assists.toString().padStart(2);
            const pts = p.stats.points.toString().padStart(3);
            const grade = p.scoutingGrade.padEnd(5);
            
            text += `${p.currentRank.toString().padStart(4)}  ${change.padStart(6)}  ${name}  ${pos}  ${team}  ${league}  ${gp}  ${g}  ${a}  ${pts}  ${grade}\n`;
        });
        
        return text;
    }
}

// Helper function to create rankings view for current draft year
function createDraftRankingsView(year, draftClass, userPlayer = null) {
    const view = new DraftRankingsView(year);
    view.initializeRankings(draftClass, userPlayer);
    return view;
}
