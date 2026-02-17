// Game Manager - Handles career mode, player progression, and game state
class GameManager {
    constructor() {
        this.player = null;
        this.currentDate = new Date(2025, 7, 15); // August 15, 2025
        this.gameFlowState = 'creatingPlayer'; // 'creatingPlayer', 'selectingSchool', 'inGame'
        this.seasonSchedule = [];
        this.activeGameScene = null;
        
        this.loadGame();
    }

    // Player Creation
    createPlayer(firstName, lastName) {
        this.player = {
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
            age: 14,
            teamName: 'Unassigned',
            teamId: 0,
            currentLeague: 'High School',
            leagueId: 9,
            skills: this.generateInitialSkills(),
            gamesPlayed: 0,
            goals: 0,
            assists: 0,
            points: 0,
            pim: 0,
            plusMinus: 0,
            bankBalance: 1000,
            draftEligibilityYear: 2027,
            scoutingReport: 'Not on draft radar.'
        };
        
        this.gameFlowState = 'selectingSchool';
        this.saveGame();
    }

    generateInitialSkills() {
        const skills = {};
        SKILLS.forEach(skill => {
            skills[skill] = Math.floor(Math.random() * 16) + 40; // 40-55 range
        });
        return skills;
    }

    // Team Selection
    selectTeam(teamId) {
        const team = getTeamById(teamId);
        if (team) {
            this.player.teamId = teamId;
            this.player.teamName = team.name;
            this.gameFlowState = 'inGame';
            this.startNewSeason();
            this.saveGame();
        }
    }

    // Season Management
    startNewSeason() {
        this.player.gamesPlayed = 0;
        this.player.goals = 0;
        this.player.assists = 0;
        this.player.points = 0;
        this.player.pim = 0;
        this.player.plusMinus = 0;
        
        this.generateSchedule();
    }

    generateSchedule() {
        const teams = getTeamsForLeague(this.player.leagueId);
        const opponents = teams.filter(t => t.id !== this.player.teamId);
        
        this.seasonSchedule = [];
        let gameDate = new Date(this.currentDate);
        gameDate.setMonth(8); // Start in September
        gameDate.setDate(5);
        
        // Generate 20 games
        for (let i = 0; i < 20; i++) {
            const opponent = opponents[i % opponents.length];
            this.seasonSchedule.push({
                gameDate: new Date(gameDate),
                opponent: opponent,
                wasPlayed: false,
                result: null
            });
            
            // Add 3-4 days between games
            gameDate.setDate(gameDate.getDate() + (Math.random() > 0.5 ? 3 : 4));
        }
    }

    // Time Progression
    advanceOneWeek() {
        const oldDate = new Date(this.currentDate);
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        
        // Check if there's a game this week
        const gameThisWeek = this.seasonSchedule.find(game => 
            !game.wasPlayed && 
            game.gameDate >= oldDate && 
            game.gameDate < this.currentDate
        );
        
        if (gameThisWeek) {
            this.playGame(gameThisWeek);
            return;
        }
        
        // Apply training and atrophy
        this.applyTraining();
        
        // Check for birthday
        if (this.currentDate.getMonth() === 7 && this.currentDate.getDate() >= 1 && this.currentDate.getDate() <= 7) {
            this.player.age++;
        }
        
        // Check for season end (May)
        if (oldDate.getMonth() === 3 && this.currentDate.getMonth() === 4) {
            this.endSeason();
        }
        
        this.saveGame();
    }

    playGame(game) {
        // Mark game as played
        game.wasPlayed = true;
        
        // Simple simulation for player stats
        const playerTeam = getTeamById(this.player.teamId);
        const opponentTeam = game.opponent;
        
        // Calculate goal differential based on ratings
        const ratingDiff = playerTeam.rating - opponentTeam.rating;
        const homeAdvantage = 5;
        const totalDiff = ratingDiff + homeAdvantage;
        
        // Simulate score
        const baseGoals = 3;
        const playerGoals = Math.max(0, baseGoals + Math.round(totalDiff / 20) + Math.floor(Math.random() * 3) - 1);
        const opponentGoals = Math.max(0, baseGoals - Math.round(totalDiff / 20) + Math.floor(Math.random() * 3) - 1);
        
        game.result = {
            playerScore: playerGoals,
            opponentScore: opponentGoals,
            playerGoals: Math.random() < 0.3 ? 1 : Math.random() < 0.15 ? 2 : 0,
            playerAssists: Math.random() < 0.4 ? 1 : Math.random() < 0.2 ? 2 : 0
        };
        
        // Update player stats
        this.player.gamesPlayed++;
        this.player.goals += game.result.playerGoals;
        this.player.assists += game.result.playerAssists;
        this.player.points = this.player.goals + this.player.assists;
        
        this.saveGame();
    }

    // Training System
    weeklyTrainingFocus = [];
    
    setTrainingFocus(skills) {
        this.weeklyTrainingFocus = skills.slice(0, 3); // Max 3 skills
    }

    applyTraining() {
        this.weeklyTrainingFocus.forEach(skill => {
            if (this.player.skills[skill]) {
                const learningRate = this.player.age < 22 ? 1 : 0.5;
                this.player.skills[skill] = Math.min(99, this.player.skills[skill] + learningRate);
            }
        });
        
        // Apply atrophy to untrained skills
        SKILLS.forEach(skill => {
            if (!this.weeklyTrainingFocus.includes(skill) && Math.random() < 0.25) {
                this.player.skills[skill] = Math.max(20, this.player.skills[skill] - 1);
            }
        });
        
        this.weeklyTrainingFocus = [];
    }

    endSeason() {
        const currentYear = this.currentDate.getFullYear();
        
        // Check for draft eligibility
        if (currentYear === this.player.draftEligibilityYear && this.player.currentLeague === 'High School') {
            this.simulateDraft();
        }
        
        // Check for career progression
        if (this.player.age >= 18 && this.player.currentLeague === 'High School') {
            this.offerCareerPaths();
        } else {
            this.startNewSeason();
        }
    }

    simulateDraft() {
        const ppg = this.player.points / (this.player.gamesPlayed || 1);
        const scoutScore = (ppg * 40) + this.player.skills['Skating'] + this.player.skills['Hockey IQ'];
        
        if (scoutScore > 150) {
            this.player.draftRound = 1;
            this.player.draftPick = Math.floor(Math.random() * 31) + 1;
            this.player.scoutingReport = 'Drafted in the 1st Round!';
        } else if (scoutScore > 120) {
            this.player.draftRound = Math.floor(Math.random() * 2) + 2;
            this.player.draftPick = Math.floor(Math.random() * 31) + 1;
            this.player.scoutingReport = `Drafted in the ${this.player.draftRound}${this.getOrdinalSuffix(this.player.draftRound)} Round!`;
        } else {
            this.player.scoutingReport = 'Went undrafted.';
        }
    }

    offerCareerPaths() {
        const ppg = this.player.points / (this.player.gamesPlayed || 1);
        const paths = [];
        
        if (ppg >= 1.5) {
            paths.push({ leagueId: 7, name: 'NCAA Division I' });
            paths.push({ leagueId: 4, name: 'Major Junior (OHL)' });
        } else if (ppg >= 0.75) {
            paths.push({ leagueId: 8, name: 'Junior A (NAHL)' });
        }
        
        return paths;
    }

    selectCareerPath(leagueId) {
        const league = getLeagueById(leagueId);
        const teams = getTeamsForLeague(leagueId);
        const newTeam = teams[Math.floor(Math.random() * teams.length)];
        
        this.player.leagueId = leagueId;
        this.player.currentLeague = league.name;
        this.player.teamId = newTeam.id;
        this.player.teamName = newTeam.name;
        
        this.startNewSeason();
        this.saveGame();
    }

    // Live Game
    startLiveGame(game) {
        const canvas = document.getElementById('game-canvas');
        const playerTeam = getTeamById(this.player.teamId);
        
        document.getElementById('home-team-name').textContent = playerTeam.name.substring(0, 3).toUpperCase();
        document.getElementById('away-team-name').textContent = game.opponent.name.substring(0, 3).toUpperCase();
        
        this.activeGameScene = new GameScene(playerTeam, game.opponent, canvas);
        this.activeGameScene.start();
    }

    endLiveGame() {
        if (this.activeGameScene) {
            this.activeGameScene.stop();
            this.activeGameScene = null;
        }
    }

    // Save/Load
    saveGame() {
        const gameState = {
            player: this.player,
            currentDate: this.currentDate.toISOString(),
            gameFlowState: this.gameFlowState,
            seasonSchedule: this.seasonSchedule.map(game => ({
                ...game,
                gameDate: game.gameDate.toISOString()
            }))
        };
        localStorage.setItem('hockeyLifeSim_save', JSON.stringify(gameState));
    }

    loadGame() {
        const saved = localStorage.getItem('hockeyLifeSim_save');
        if (saved) {
            try {
                const gameState = JSON.parse(saved);
                this.player = gameState.player;
                this.currentDate = new Date(gameState.currentDate);
                this.gameFlowState = gameState.gameFlowState || 'creatingPlayer';
                this.seasonSchedule = (gameState.seasonSchedule || []).map(game => ({
                    ...game,
                    gameDate: new Date(game.gameDate),
                    opponent: game.opponent
                }));
            } catch (e) {
                console.error('Failed to load game:', e);
            }
        }
    }

    getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }
}
