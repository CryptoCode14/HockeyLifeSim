// Game Scene - Manages live hockey game simulation
class GameScene {
    constructor(homeTeam, awayTeam, canvas) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.physics = new PhysicsEngine(this.width, this.height);
        
        // Game state
        this.period = 1;
        this.gameTime = 1200; // 20 minutes = 1200 seconds
        this.homeScore = 0;
        this.awayScore = 0;
        this.homeSOG = 0;
        this.awaySOG = 0;
        this.homePenalties = 0;
        this.awayPenalties = 0;
        
        // New game features
        this.isPowerPlay = false;
        this.powerPlayTeam = null;
        this.powerPlayTime = 0;
        this.momentum = 0; // -100 (away) to +100 (home)
        this.lastGoalScorer = null;
        this.celebrationTimer = 0;
        this.replayMode = false;
        this.gameEvents = [];
        
        // Goal areas
        this.homeGoalArea = { x: 60, y: 385, width: 40, height: 80 };
        this.awayGoalArea = { x: 900, y: 385, width: 40, height: 80 };
        
        // Create entities
        this.players = [];
        this.goalies = [];
        this.aiControllers = [];
        this.createPlayers();
        
        this.puck = new Puck(this.width / 2, this.height / 2);
        
        // Animation
        this.lastTime = performance.now();
        this.isRunning = false;
        this.animationId = null;
    }

    createPlayers() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Home team (left side)
        const homePositions = [
            { role: 'C', x: centerX - 100, y: centerY },
            { role: 'LW', x: centerX - 150, y: centerY - 150 },
            { role: 'RW', x: centerX - 150, y: centerY + 150 },
            { role: 'LD', x: 250, y: centerY - 100 },
            { role: 'RD', x: 250, y: centerY + 100 }
        ];
        
        homePositions.forEach(pos => {
            const player = new Player(pos.x, pos.y, 'home', pos.role);
            this.players.push(player);
            this.aiControllers.push(new AIController(player, this.width, this.height));
        });
        
        const homeGoalie = new Player(80, centerY, 'home', 'G');
        this.goalies.push(homeGoalie);
        this.aiControllers.push(new AIController(homeGoalie, this.width, this.height));
        
        // Away team (right side)
        const awayPositions = [
            { role: 'C', x: centerX + 100, y: centerY },
            { role: 'LW', x: centerX + 150, y: centerY - 150 },
            { role: 'RW', x: centerX + 150, y: centerY + 150 },
            { role: 'LD', x: this.width - 250, y: centerY - 100 },
            { role: 'RD', x: this.width - 250, y: centerY + 100 }
        ];
        
        awayPositions.forEach(pos => {
            const player = new Player(pos.x, pos.y, 'away', pos.role);
            this.players.push(player);
            this.aiControllers.push(new AIController(player, this.width, this.height));
        });
        
        const awayGoalie = new Player(this.width - 80, centerY, 'away', 'G');
        this.goalies.push(awayGoalie);
        this.aiControllers.push(new AIController(awayGoalie, this.width, this.height));
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    gameLoop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 0.1s
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Update game clock
        if (this.gameTime > 0) {
            this.gameTime -= deltaTime;
        } else if (this.period < 3) {
            this.period++;
            this.gameTime = 1200;
            this.faceoff();
        }

        // Update power play timer
        if (this.isPowerPlay && this.powerPlayTime > 0) {
            this.powerPlayTime -= deltaTime;
            if (this.powerPlayTime <= 0) {
                this.isPowerPlay = false;
                this.powerPlayTeam = null;
            }
        }

        // Update celebration timer
        if (this.celebrationTimer > 0) {
            this.celebrationTimer -= deltaTime;
        }

        // Update AI
        const allPlayers = [...this.players, ...this.goalies];
        this.aiControllers.forEach(controller => {
            controller.update(this.puck, allPlayers, deltaTime);
        });

        // Update physics
        this.physics.update(this.players, this.puck, this.goalies, deltaTime);

        // Check for goals
        const goalScored = this.physics.checkGoal(this.puck, this.homeGoalArea, this.awayGoalArea);
        if (goalScored) {
            this.handleGoal(goalScored);
            this.faceoff();
        }

        // Check for penalties (random chance)
        if (Math.random() < 0.0005 && !this.isPowerPlay) { // 0.05% chance per frame
            this.callPenalty();
        }

        // Update momentum
        this.updateMomentum(deltaTime);

        // Update UI
        this.updateUI();
    }

    handleGoal(scoringTeam) {
        if (scoringTeam === 'home') {
            this.homeScore++;
            this.homeSOG++;
            this.momentum += 20;
            this.lastGoalScorer = 'home';
        } else {
            this.awayScore++;
            this.awaySOG++;
            this.momentum -= 20;
            this.lastGoalScorer = 'away';
        }
        
        // Start celebration
        this.celebrationTimer = 3;
        
        // Log event
        this.gameEvents.push({
            type: 'goal',
            team: scoringTeam,
            time: this.gameTime,
            period: this.period
        });
    }

    callPenalty() {
        const penaltyTeam = Math.random() < 0.5 ? 'home' : 'away';
        if (penaltyTeam === 'home') {
            this.homePenalties++;
            this.powerPlayTeam = 'away';
        } else {
            this.awayPenalties++;
            this.powerPlayTeam = 'home';
        }
        
        this.isPowerPlay = true;
        this.powerPlayTime = 120; // 2 minute penalty
        
        this.gameEvents.push({
            type: 'penalty',
            team: penaltyTeam,
            time: this.gameTime,
            period: this.period
        });
    }

    updateMomentum(deltaTime) {
        // Momentum naturally decays toward neutral
        if (this.momentum > 0) {
            this.momentum = Math.max(0, this.momentum - deltaTime * 2);
        } else if (this.momentum < 0) {
            this.momentum = Math.min(0, this.momentum + deltaTime * 2);
        }
        
        // Clamp momentum
        this.momentum = Math.max(-100, Math.min(100, this.momentum));
    }
        }

        // Update UI
        this.updateUI();
    }

    faceoff() {
        // Reset positions for faceoff
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.puck.position = new Vector2(centerX, centerY);
        this.puck.velocity = new Vector2(0, 0);
        this.puck.owner = null;
        
        // Reset player positions (simplified)
        this.players.forEach(player => {
            player.hasPuck = false;
        });
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2d5016';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw rink markings
        this.drawRink();

        // Draw goals
        this.drawGoal(this.homeGoalArea, '#ff0000');
        this.drawGoal(this.awayGoalArea, '#ff0000');

        // Draw celebration effect if active
        if (this.celebrationTimer > 0) {
            this.drawCelebration();
        }

        // Draw momentum indicator
        this.drawMomentum();

        // Draw players
        this.players.forEach(player => this.drawPlayer(player));
        this.goalies.forEach(goalie => this.drawPlayer(goalie));

        // Draw puck
        this.drawPuck();

        // Draw power play indicator
        if (this.isPowerPlay) {
            this.drawPowerPlayIndicator();
        }
    }

    drawCelebration() {
        // Flash effect
        const alpha = Math.sin(this.celebrationTimer * 5) * 0.3 + 0.3;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Goal text
        if (this.celebrationTimer > 2) {
            this.ctx.save();
            this.ctx.font = 'bold 80px Arial';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 4;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const text = 'GOAL!';
            this.ctx.strokeText(text, this.width / 2, this.height / 2);
            this.ctx.fillText(text, this.width / 2, this.height / 2);
            this.ctx.restore();
        }
    }

    drawMomentum() {
        const barWidth = 200;
        const barHeight = 20;
        const x = this.width / 2 - barWidth / 2;
        const y = 10;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // Momentum bar
        const momentumWidth = Math.abs(this.momentum) / 100 * (barWidth / 2);
        if (this.momentum > 0) {
            this.ctx.fillStyle = '#0066cc';
            this.ctx.fillRect(x + barWidth / 2, y, momentumWidth, barHeight);
        } else {
            this.ctx.fillStyle = '#cc0000';
            this.ctx.fillRect(x + barWidth / 2 - momentumWidth, y, momentumWidth, barHeight);
        }
        
        // Center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + barWidth / 2, y);
        this.ctx.lineTo(x + barWidth / 2, y + barHeight);
        this.ctx.stroke();
    }

    drawPowerPlayIndicator() {
        this.ctx.save();
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = 'center';
        const ppText = `POWER PLAY - ${Math.ceil(this.powerPlayTime)}s`;
        this.ctx.strokeText(ppText, this.width / 2, 45);
        this.ctx.fillText(ppText, this.width / 2, 45);
        this.ctx.restore();
    }

    drawRink() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 25);
        this.ctx.lineTo(this.width / 2, this.height - 25);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, 80, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Blue lines
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.3, 25);
        this.ctx.lineTo(this.width * 0.3, this.height - 25);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.7, 25);
        this.ctx.lineTo(this.width * 0.7, this.height - 25);
        this.ctx.stroke();
    }

    drawGoal(goalArea, color) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(goalArea.x, goalArea.y, goalArea.width, goalArea.height);
        this.ctx.globalAlpha = 1.0;
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(goalArea.x, goalArea.y, goalArea.width, goalArea.height);
    }

    drawPlayer(player) {
        const color = player.team === 'home' ? '#0066cc' : '#cc0000';
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw role text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(player.role, player.position.x, player.position.y);
    }

    drawPuck() {
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(this.puck.position.x, this.puck.position.y, this.puck.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    updateUI() {
        document.getElementById('home-score').textContent = this.homeScore;
        document.getElementById('away-score').textContent = this.awayScore;
        document.getElementById('period-display').textContent = this.getOrdinal(this.period);
        document.getElementById('game-clock').textContent = this.formatTime(this.gameTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(Math.max(0, seconds) / 60);
        const secs = Math.floor(Math.max(0, seconds) % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getOrdinal(num) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
}
