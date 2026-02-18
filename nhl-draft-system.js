// NHL Draft System - Complete 7-Round Draft with Scouting

class NHLDraftSystem {
    constructor() {
        this.draftYear = new Date().getFullYear();
        this.draftPicks = [];
        this.prospects = [];
        this.centralScoutingRankings = {
            naSkaters: [],
            naGoalies: [],
            euroSkaters: [],
            euroGoalies: []
        };
        this.playerRanking = null;
        this.draftPosition = null;
        this.combineResults = null;
    }

    // Generate draft prospects for current year
    generateDraftProspects(count = 500) {
        this.prospects = [];
        
        // Generate top prospects with realistic distributions
        for (let i = 0; i < count; i++) {
            const prospect = this.generateProspect(i + 1);
            this.prospects.push(prospect);
        }
        
        // Rank prospects
        this.rankProspects();
        
        return this.prospects;
    }

    generateProspect(rankingNumber) {
        // Determine region based on ranking (top prospects more likely from hockey regions)
        let region;
        if (rankingNumber <= 50) {
            const regions = ['canadian', 'canadian', 'american', 'scandinavian', 'russian'];
            region = regions[Math.floor(Math.random() * regions.length)];
        } else if (rankingNumber <= 150) {
            const regions = ['canadian', 'american', 'scandinavian', 'russian', 'czech'];
            region = regions[Math.floor(Math.random() * regions.length)];
        } else {
            const regions = ['canadian', 'american', 'scandinavian', 'russian', 'czech', 'northAmerican'];
            region = regions[Math.floor(Math.random() * regions.length)];
        }
        
        const name = generateRealisticName(region);
        
        // Position distribution (more forwards than defense, few goalies)
        let position;
        const posRand = Math.random();
        if (posRand < 0.5) position = 'C';
        else if (posRand < 0.7) position = 'LW';
        else if (posRand < 0.85) position = 'RW';
        else if (posRand < 0.92) position = 'LD';
        else if (posRand < 0.97) position = 'RD';
        else position = 'G';
        
        // Overall rating based on ranking
        let overall;
        if (rankingNumber <= 10) overall = Math.floor(Math.random() * 5) + 75; // 75-80 (Elite)
        else if (rankingNumber <= 31) overall = Math.floor(Math.random() * 5) + 70; // 70-75 (1st round)
        else if (rankingNumber <= 62) overall = Math.floor(Math.random() * 5) + 65; // 65-70 (2nd round)
        else if (rankingNumber <= 93) overall = Math.floor(Math.random() * 5) + 60; // 60-65 (3rd round)
        else if (rankingNumber <= 155) overall = Math.floor(Math.random() * 8) + 55; // 55-63 (4-5th round)
        else if (rankingNumber <= 224) overall = Math.floor(Math.random() * 10) + 50; // 50-60 (6-7th round)
        else overall = Math.floor(Math.random() * 15) + 45; // 45-60 (undrafted)
        
        // Potential (younger players have higher ceilings)
        const age = 18; // Draft eligible age
        const potentialRange = Math.floor(Math.random() * 15) + 5;
        const potential = Math.min(99, overall + potentialRange);
        
        // League distribution
        const leagues = ['OHL', 'WHL', 'QMJHL', 'USHL', 'NCAA', 'USDP', 'SHL', 'Liiga', 'VHL', 'High School'];
        const leagueWeights = [20, 20, 15, 12, 10, 8, 5, 5, 3, 2];
        let league = this.weightedRandom(leagues, leagueWeights);
        
        const prospect = {
            ...name,
            position,
            age,
            overall,
            potential,
            league,
            team: this.getRandomTeamForLeague(league),
            height: generateHeight(position),
            weight: generateWeight(position),
            handedness: Math.random() < 0.7 ? 'L' : 'R',
            draftEligible: true,
            ranking: rankingNumber,
            
            // Scouting report attributes
            skating: this.generateSkillRating(overall),
            shooting: this.generateSkillRating(overall),
            hands: this.generateSkillRating(overall),
            passing: this.generateSkillRating(overall),
            defense: this.generateSkillRating(overall),
            hockey_iq: this.generateSkillRating(overall),
            physicality: this.generateSkillRating(overall),
            compete: this.generateSkillRating(overall),
            
            // Advanced stats (season)
            gp: Math.floor(Math.random() * 10) + 55,
            goals: Math.floor(Math.random() * 40),
            assists: Math.floor(Math.random() * 50),
            pim: Math.floor(Math.random() * 40),
            
            // Projection
            projectedPick: this.getProjectedPick(rankingNumber),
            riskLevel: this.getRiskLevel(rankingNumber, overall, potential),
            nhlComparison: this.getNHLComparison(position, overall),
            
            // Strengths and weaknesses
            strengths: this.generateStrengths(position, overall),
            weaknesses: this.generateWeaknesses(position, overall),
            
            // Background
            birthplace: this.getBirthplace(region),
            draftYear: this.draftYear
        };
        
        // Calculate points
        prospect.points = prospect.goals + prospect.assists;
        
        return prospect;
    }

    generateSkillRating(overall) {
        const variance = Math.floor(Math.random() * 15) - 7; // ±7
        return Math.max(30, Math.min(99, overall + variance));
    }

    getProjectedPick(ranking) {
        const variance = Math.floor(Math.random() * 20) - 10; // ±10 picks
        const pick = Math.max(1, ranking + variance);
        
        if (pick <= 31) return { round: 1, pick: pick };
        else if (pick <= 62) return { round: 2, pick: pick - 31 };
        else if (pick <= 93) return { round: 3, pick: pick - 62 };
        else if (pick <= 124) return { round: 4, pick: pick - 93 };
        else if (pick <= 155) return { round: 5, pick: pick - 124 };
        else if (pick <= 186) return { round: 6, pick: pick - 155 };
        else return { round: 7, pick: Math.min(31, pick - 186) };
    }

    getRiskLevel(ranking, overall, potential) {
        const gap = potential - overall;
        if (gap > 20 && ranking > 50) return 'High Risk, High Reward';
        else if (gap > 15) return 'Moderate Risk';
        else if (ranking <= 31) return 'Safe Pick';
        else return 'Low Risk';
    }

    getNHLComparison(position, overall) {
        const comparisons = {
            C: {
                elite: ['Connor McDavid', 'Auston Matthews', 'Sidney Crosby', 'Nathan MacKinnon'],
                high: ['Elias Pettersson', 'Matthew Tkachuk', 'Jack Hughes', 'Tim Stützle'],
                mid: ['Bo Horvat', 'Sean Couturier', 'Ryan O\'Reilly', 'Tyler Seguin'],
                low: ['Lars Eller', 'Nick Bjugstad', 'Barclay Goodrow', 'Riley Nash']
            },
            LW: {
                elite: ['Alex Ovechkin', 'Kirill Kaprizov', 'Brad Marchand', 'Gabriel Landeskog'],
                high: ['Jason Robertson', 'Kyle Connor', 'Jake Guentzel', 'Jordan Kyrou'],
                mid: ['Tanner Pearson', 'Tyler Bertuzzi', 'Ondrej Palat', 'Alex Kerfoot'],
                low: ['Zach Aston-Reese', 'Austin Watson', 'Matthew Nieto', 'Jimmy Vesey']
            },
            RW: {
                elite: ['Nikita Kucherov', 'Patrick Kane', 'David Pastrnak', 'Mitchell Marner'],
                high: ['Tim Meier', 'Jesper Bratt', 'Vladimir Tarasenko', 'Brock Boeser'],
                mid: ['Blake Coleman', 'Tyler Toffoli', 'Conor Garland', 'Barclay Goodrow'],
                low: ['Zack MacEwen', 'Kiefer Sherwood', 'Brandon Tanev', 'Austin Watson']
            },
            LD: {
                elite: ['Cale Makar', 'Quinn Hughes', 'Victor Hedman', 'Miro Heiskanen'],
                high: ['Devon Toews', 'Mackenzie Weegar', 'Jake Sanderson', 'K\'Andre Miller'],
                mid: ['Jake McCabe', 'Jonas Siegenthaler', 'Calvin de Haan', 'Nick Seeler'],
                low: ['Derrick Pouliot', 'Ben Harpur', 'Mark Alt', 'Christian Jaros']
            },
            RD: {
                elite: ['Adam Fox', 'Roman Josi', 'Erik Karlsson', 'Dougie Hamilton'],
                high: ['Charlie McAvoy', 'Rasmus Dahlin', 'Evan Bouchard', 'Moritz Seider'],
                mid: ['Radko Gudas', 'Josh Manson', 'Erik Cernak', 'Ryan Graves'],
                low: ['Luke Schenn', 'Tucker Poolman', 'Travis Dermott', 'Matt Benning']
            },
            G: {
                elite: ['Connor Hellebuyck', 'Igor Shesterkin', 'Andrei Vasilevskiy', 'Ilya Sorokin'],
                high: ['Juuse Saros', 'Jake Oettinger', 'Linus Ullmark', 'Jeremy Swayman'],
                mid: ['Jonathan Quick', 'Vitek Vanecek', 'Adin Hill', 'Mackenzie Blackwood'],
                low: ['Kaapo Kahkonen', 'Joel Hofer', 'Spencer Martin', 'Aaron Dell']
            }
        };
        
        let tier;
        if (overall >= 75) tier = 'elite';
        else if (overall >= 65) tier = 'high';
        else if (overall >= 55) tier = 'mid';
        else tier = 'low';
        
        const options = comparisons[position][tier];
        return options[Math.floor(Math.random() * options.length)];
    }

    generateStrengths(position, overall) {
        const allStrengths = [
            'Elite skating ability', 'Excellent shot', 'Great playmaking vision', 'High hockey IQ',
            'Physical presence', 'Strong puck protection', 'Defensive awareness', 'Leadership qualities',
            'Work ethic', 'Compete level', 'Two-way ability', 'Power play specialist',
            'Penalty kill expert', 'Faceoff specialist', 'Strong in corners', 'Quick release'
        ];
        
        const count = overall >= 70 ? 4 : overall >= 60 ? 3 : 2;
        const strengths = [];
        
        for (let i = 0; i < count; i++) {
            const strength = allStrengths[Math.floor(Math.random() * allStrengths.length)];
            if (!strengths.includes(strength)) strengths.push(strength);
        }
        
        return strengths;
    }

    generateWeaknesses(position, overall) {
        const allWeaknesses = [
            'Needs to add strength', 'Skating needs improvement', 'Inconsistent effort', 
            'Defensive awareness', 'Decision-making', 'Needs to shoot more', 'Injury concerns',
            'Size limitations', 'Compete level', 'Passing accuracy', 'One-dimensional',
            'Needs better conditioning'
        ];
        
        const count = overall >= 70 ? 1 : overall >= 60 ? 2 : 3;
        const weaknesses = [];
        
        for (let i = 0; i < count; i++) {
            const weakness = allWeaknesses[Math.floor(Math.random() * allWeaknesses.length)];
            if (!weaknesses.includes(weakness)) weaknesses.push(weakness);
        }
        
        return weaknesses;
    }

    getBirthplace(region) {
        const cities = {
            canadian: ['Toronto, ON', 'Montreal, QC', 'Vancouver, BC', 'Calgary, AB', 'Edmonton, AB', 'Ottawa, ON', 'Winnipeg, MB'],
            american: ['Minneapolis, MN', 'Boston, MA', 'Detroit, MI', 'Chicago, IL', 'New York, NY', 'Los Angeles, CA'],
            scandinavian: ['Stockholm, Sweden', 'Helsinki, Finland', 'Oslo, Norway', 'Copenhagen, Denmark'],
            russian: ['Moscow, Russia', 'St. Petersburg, Russia', 'Yaroslavl, Russia', 'Chelyabinsk, Russia'],
            czech: ['Prague, Czech Republic', 'Brno, Czech Republic', 'Plzen, Czech Republic']
        };
        
        const options = cities[region] || cities.canadian;
        return options[Math.floor(Math.random() * options.length)];
    }

    getRandomTeamForLeague(league) {
        const teams = {
            'OHL': ['London Knights', 'Ottawa 67\'s', 'Kitchener Rangers', 'Sault Ste. Marie Greyhounds'],
            'WHL': ['Portland Winterhawks', 'Seattle Thunderbirds', 'Everett Silvertips', 'Spokane Chiefs'],
            'QMJHL': ['Halifax Mooseheads', 'Quebec Remparts', 'Moncton Wildcats', 'Rimouski Oceanic'],
            'USHL': ['Chicago Steel', 'Youngstown Phantoms', 'Tri-City Storm', 'Dubuque Fighting Saints'],
            'NCAA': ['Boston College', 'University of Michigan', 'University of Minnesota', 'Boston University'],
            'USDP': ['U.S. National Development Team'],
            'SHL': ['Frölunda HC', 'Djurgårdens IF', 'Färjestad BK', 'Luleå HF'],
            'Liiga': ['TPS', 'HIFK', 'Tappara', 'Kärpät'],
            'VHL': ['SKA St. Petersburg', 'Ak Bars Kazan', 'CSKA Moscow', 'Dynamo Moscow'],
            'High School': ['Edina High School', 'Hill-Murray', 'Wayzata', 'Shattuck-St. Mary\'s']
        };
        
        const options = teams[league] || ['Unknown'];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Rank all prospects using Central Scouting methodology
    rankProspects() {
        // Separate by category
        this.centralScoutingRankings.naSkaters = this.prospects
            .filter(p => ['canadian', 'american', 'northAmerican'].includes(p.region) && p.position !== 'G')
            .sort((a, b) => a.ranking - b.ranking);
        
        this.centralScoutingRankings.naGoalies = this.prospects
            .filter(p => ['canadian', 'american', 'northAmerican'].includes(p.region) && p.position === 'G')
            .sort((a, b) => a.ranking - b.ranking);
        
        this.centralScoutingRankings.euroSkaters = this.prospects
            .filter(p => ['scandinavian', 'russian', 'czech'].includes(p.region) && p.position !== 'G')
            .sort((a, b) => a.ranking - b.ranking);
        
        this.centralScoutingRankings.euroGoalies = this.prospects
            .filter(p => ['scandinavian', 'russian', 'czech'].includes(p.region) && p.position === 'G')
            .sort((a, b) => a.ranking - b.ranking);
    }

    // Run NHL Draft Combine
    runDraftCombine(player) {
        const results = {
            skating: this.runSkatingTest(player),
            shooting: this.runShootingTest(player),
            strength: this.runStrengthTest(player),
            endurance: this.runEnduranceTest(player),
            interview: this.runInterview(player),
            overallRank: 0
        };
        
        // Calculate overall combine rank
        results.overallRank = Math.floor(
            (results.skating.percentile + results.shooting.percentile + 
             results.strength.percentile + results.endurance.percentile + 
             results.interview.score) / 5
        );
        
        this.combineResults = results;
        return results;
    }

    runSkatingTest(player) {
        const baseTime = 5.5; // seconds for skating test
        const skillMod = (player.skills.Skating - 50) * 0.05;
        const randomVar = (Math.random() - 0.5) * 0.3;
        const time = Math.max(4.5, baseTime - skillMod + randomVar);
        
        return {
            time: time.toFixed(2),
            percentile: Math.min(99, Math.floor((6.5 - time) / 2 * 100))
        };
    }

    runShootingTest(player) {
        const baseAccuracy = 60;
        const skillMod = (player.skills['Shooting Accuracy'] - 50) * 0.5;
        const randomVar = (Math.random() - 0.5) * 10;
        const accuracy = Math.max(40, Math.min(95, baseAccuracy + skillMod + randomVar));
        
        return {
            accuracy: Math.floor(accuracy),
            percentile: Math.floor(accuracy)
        };
    }

    runStrengthTest(player) {
        const benchPress = Math.floor(Math.random() * 30) + player.skills.Strength * 0.3;
        return {
            reps: Math.floor(benchPress),
            percentile: Math.min(99, Math.floor(benchPress * 2))
        };
    }

    runEnduranceTest(player) {
        const vo2max = 50 + player.skills.Conditioning * 0.5 + Math.random() * 10;
        return {
            vo2max: Math.floor(vo2max),
            percentile: Math.min(99, Math.floor((vo2max - 50) * 2))
        };
    }

    runInterview(player) {
        let score = 50;
        score += player.reputation / 2;
        score += player.confidence / 2;
        if (player.personality.id === 'leader') score += 15;
        if (player.personality.id === 'clutch') score += 10;
        score += (Math.random() - 0.5) * 20;
        
        return {
            score: Math.max(20, Math.min(100, Math.floor(score))),
            feedback: score >= 80 ? 'Excellent interview' : score >= 60 ? 'Good interview' : 'Needs improvement'
        };
    }

    // Simulate draft and determine where player is selected
    simulateDraft(player) {
        const playerRanking = this.calculatePlayerDraftRanking(player);
        this.playerRanking = playerRanking;
        
        // Add variance for draft day surprises
        const variance = Math.floor(Math.random() * 40) - 20; // ±20 picks
        let draftPick = Math.max(1, Math.min(224, playerRanking.overallRank + variance));
        
        // Calculate round and pick
        const round = Math.ceil(draftPick / 32);
        const pickInRound = draftPick % 32 || 32;
        
        // Random NHL team (simplified - would use actual draft order)
        const draftingTeam = NHL_TEAMS[Math.floor(Math.random() * NHL_TEAMS.length)];
        
        this.draftPosition = {
            round,
            pick: pickInRound,
            overall: draftPick,
            team: draftingTeam,
            year: this.draftYear
        };
        
        return this.draftPosition;
    }

    calculatePlayerDraftRanking(player) {
        let score = 0;
        
        // Performance (40 points)
        const ppg = player.points / (player.gamesPlayed || 1);
        score += Math.min(40, ppg * 20);
        
        // Skills (30 points)
        const avgSkill = Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.keys(player.skills).length;
        score += (avgSkill - 40) / 2;
        
        // Potential/Age (15 points)
        if (player.age <= 18) score += 15;
        else score += Math.max(0, 15 - (player.age - 18) * 3);
        
        // Intangibles (15 points)
        score += player.reputation / 10;
        score += player.confidence / 10;
        
        // Combine results bonus
        if (this.combineResults) {
            score += this.combineResults.overallRank / 10;
        }
        
        const finalScore = Math.max(0, Math.min(100, score));
        
        // Convert score to draft ranking (1-224)
        const overallRank = Math.floor(224 - (finalScore / 100 * 223));
        
        return {
            score: finalScore,
            overallRank,
            grade: finalScore >= 85 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 55 ? 'C' : 'D'
        };
    }

    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            if (random < weights[i]) return items[i];
            random -= weights[i];
        }
        
        return items[items.length - 1];
    }
}
