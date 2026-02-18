// Overhauled Game Scene - Modern, Fast, Realistic Hockey Simulation

class GameScene {
    constructor(homeTeam, awayTeam, canvas, playerData) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.playerData = playerData || { overall: 70, skating: 70, shooting: 70, passing: 70, defense: 70 };
        
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.period = 1;
        this.gameTime = 1200; // 20 minutes per period
        this.homeScore = 0;
        this.awayScore = 0;
        this.homeSOG = 0;
        this.awaySOG = 0;
        
        // Game features
        this.isPowerPlay = false;
        this.powerPlayTeam = null;
        this.powerPlayTime = 0;
        this.momentum = 0; // -100 (away) to +100 (home)
        this.celebrationTimer = 0;
        this.saveFlashTimer = 0;
        this.postHitFlash = 0; // Visual feedback for post hits
        this.crossbarHitFlash = 0; // Visual feedback for crossbar hits
        this.gameEvents = [];
        this.shotTrails = []; // Visual shot trails
        this.passLines = []; // Visual pass lines
        
        // Create players with ratings
        this.players = [];
        this.goalies = [];
        this.createPlayers();
        
        // Puck
        this.puck = {
            x: this.width / 2,
            y: this.height / 2,
            vx: 0,
            vy: 0,
            owner: null,
            inAir: false
        };
        
        // Animation
        this.lastTime = performance.now();
        this.isRunning = false;
        this.animationId = null;
    }
    
    createPlayers() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Get player ratings (use user's ratings for their team, random for others)
        // NHL TV broadcast shows players skating at about 20-25 mph (32-40 km/h)
        // On our rink (1400px wide), players should cross in ~3-4 seconds for realism
        const getPlayerRating = (team, role) => {
            const baseRating = 65 + Math.random() * 15; // 65-80
            return {
                overall: baseRating,
                skating: baseRating + (Math.random() - 0.5) * 10,
                shooting: baseRating + (Math.random() - 0.5) * 10,
                passing: baseRating + (Math.random() - 0.5) * 10,
                defense: baseRating + (Math.random() - 0.5) * 10,
                speed: 350 + baseRating * 2 // 480-510 pixels/sec (NHL TV broadcast feel)
            };
        };
        
        // Home team players (left side)
        const homePositions = [
            { role: 'C', x: centerX - 200, y: centerY },
            { role: 'LW', x: centerX - 250, y: centerY - 100 },
            { role: 'RW', x: centerX - 250, y: centerY + 100 },
            { role: 'LD', x: 300, y: centerY - 80 },
            { role: 'RD', x: 300, y: centerY + 80 }
        ];
        
        homePositions.forEach(pos => {
            const ratings = getPlayerRating('home', pos.role);
            this.players.push({
                x: pos.x,
                y: pos.y,
                vx: 0,
                vy: 0,
                team: 'home',
                role: pos.role,
                hasPuck: false,
                target: null,
                state: 'defend', // defend, chase, carry, pass, shoot
                ...ratings
            });
        });
        
        const homeGoalie = {
            x: 100,
            y: centerY,
            vx: 0,
            vy: 0,
            team: 'home',
            role: 'G',
            hasPuck: false,
            goalie: true,
            saveRating: 70 + Math.random() * 20, // 70-90
            speed: 400
        };
        this.goalies.push(homeGoalie);
        
        // Away team players (right side)
        const awayPositions = [
            { role: 'C', x: centerX + 200, y: centerY },
            { role: 'LW', x: centerX + 250, y: centerY - 100 },
            { role: 'RW', x: centerX + 250, y: centerY + 100 },
            { role: 'LD', x: this.width - 300, y: centerY - 80 },
            { role: 'RD', x: this.width - 300, y: centerY + 80 }
        ];
        
        awayPositions.forEach(pos => {
            const ratings = getPlayerRating('away', pos.role);
            this.players.push({
                x: pos.x,
                y: pos.y,
                vx: 0,
                vy: 0,
                team: 'away',
                role: pos.role,
                hasPuck: false,
                target: null,
                state: 'defend',
                ...ratings
            });
        });
        
        const awayGoalie = {
            x: this.width - 100,
            y: centerY,
            vx: 0,
            vy: 0,
            team: 'away',
            role: 'G',
            hasPuck: false,
            goalie: true,
            saveRating: 70 + Math.random() * 20,
            speed: 400
        };
        this.goalies.push(awayGoalie);
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
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        // Update game clock
        if (this.gameTime > 0 && this.celebrationTimer <= 0) {
            this.gameTime -= deltaTime;
        } else if (this.gameTime <= 0 && this.period < 3) {
            this.period++;
            this.gameTime = 1200;
            this.faceoff();
        }
        
        // Update power play
        if (this.isPowerPlay && this.powerPlayTime > 0) {
            this.powerPlayTime -= deltaTime;
            if (this.powerPlayTime <= 0) {
                this.isPowerPlay = false;
                this.powerPlayTeam = null;
            }
        }
        
        // Update timers
        if (this.celebrationTimer > 0) {
            this.celebrationTimer -= deltaTime;
        }
        if (this.saveFlashTimer > 0) {
            this.saveFlashTimer -= deltaTime;
        }
        
        // Update visual effects
        this.shotTrails = this.shotTrails.filter(trail => trail.life > 0);
        this.shotTrails.forEach(trail => trail.life -= deltaTime * 2);
        
        this.passLines = this.passLines.filter(line => line.life > 0);
        this.passLines.forEach(line => line.life -= deltaTime * 3);
        
        // Skip updates during celebration
        if (this.celebrationTimer > 0) {
            this.updateUI();
            return;
        }
        
        // Update AI for all players
        [...this.players, ...this.goalies].forEach(player => {
            this.updatePlayerAI(player, deltaTime);
        });
        
        // Update puck physics
        this.updatePuck(deltaTime);
        
        // Check for goals
        this.checkGoals();
        
        // Random penalty chance
        if (Math.random() < 0.0003 && !this.isPowerPlay) {
            this.callPenalty();
        }
        
        // Update momentum
        this.updateMomentum(deltaTime);
        
        // Update UI
        this.updateUI();
    }
    
    updatePlayerAI(player, deltaTime) {
        const isHomeTeam = player.team === 'home';
        const opponentGoal = isHomeTeam ? 
            { x: this.width - 80, y: this.height / 2 } : 
            { x: 80, y: this.height / 2 };
        const ownGoal = isHomeTeam ?
            { x: 80, y: this.height / 2 } :
            { x: this.width - 80, y: this.height / 2 };
        
        // Goalie AI
        if (player.goalie) {
            this.goalieAI(player, ownGoal, deltaTime);
            return;
        }
        
        // Player has puck
        if (player.hasPuck && this.puck.owner === player) {
            this.offensiveAI(player, opponentGoal, deltaTime);
        } else {
            // Try to get puck or defend
            this.defensiveAI(player, opponentGoal, ownGoal, deltaTime);
        }
    }
    
    goalieAI(goalie, ownGoal, deltaTime) {
        // Stay near goal and track puck
        const targetX = ownGoal.x;
        const targetY = Math.max(this.height * 0.35, Math.min(this.height * 0.65, this.puck.y));
        
        this.movePlayerTowards(goalie, targetX, targetY, deltaTime);
        
        // Try to catch puck if close
        const dist = this.distance(goalie.x, goalie.y, this.puck.x, this.puck.y);
        if (dist < 30 && !this.puck.owner) {
            this.puck.owner = goalie;
            goalie.hasPuck = true;
        }
    }
    
    offensiveAI(player, opponentGoal, deltaTime) {
        // Carry puck
        this.puck.x = player.x + (player.team === 'home' ? 15 : -15);
        this.puck.y = player.y;
        this.puck.vx = 0;
        this.puck.vy = 0;
        
        const distToGoal = this.distance(player.x, player.y, opponentGoal.x, opponentGoal.y);
        
        // Shoot if close enough and in front
        if (distToGoal < 200 && Math.random() < 0.02) {
            this.shootPuck(player, opponentGoal);
            return;
        }
        
        // Pass if teammate is in better position (20% chance)
        if (Math.random() < 0.01) {
            const teammates = this.players.filter(p => p.team === player.team && p !== player);
            const goodTeammate = teammates.find(t => {
                const tDist = this.distance(t.x, t.y, opponentGoal.x, opponentGoal.y);
                return tDist < distToGoal - 50;
            });
            if (goodTeammate) {
                this.passPuck(player, goodTeammate);
                return;
            }
        }
        
        // Skate toward opponent goal
        const targetX = opponentGoal.x + (player.team === 'home' ? -150 : 150);
        const targetY = opponentGoal.y + (Math.random() - 0.5) * 100;
        this.movePlayerTowards(player, targetX, targetY, deltaTime);
    }
    
    defensiveAI(player, opponentGoal, ownGoal, deltaTime) {
        const puckOwner = this.puck.owner;
        
        // Chase puck if no owner
        if (!puckOwner) {
            const distToPuck = this.distance(player.x, player.y, this.puck.x, this.puck.y);
            if (distToPuck < 500) {
                this.movePlayerTowards(player, this.puck.x, this.puck.y, deltaTime);
                
                // Pick up puck if close
                if (distToPuck < 20) {
                    this.puck.owner = player;
                    player.hasPuck = true;
                }
            } else {
                // Return to defensive position
                this.moveToDefensivePosition(player, ownGoal, deltaTime);
            }
        } else if (puckOwner.team !== player.team) {
            // Chase opponent with puck
            this.movePlayerTowards(player, puckOwner.x, puckOwner.y, deltaTime);
            
            // Steal puck if close
            const dist = this.distance(player.x, player.y, puckOwner.x, puckOwner.y);
            if (dist < 30 && Math.random() < 0.015) { // 1.5% chance per frame
                puckOwner.hasPuck = false;
                this.puck.owner = player;
                player.hasPuck = true;
            }
        } else {
            // Teammate has puck, get into position
            this.moveToOffensivePosition(player, opponentGoal, deltaTime);
        }
    }
    
    movePlayerTowards(player, targetX, targetY, deltaTime) {
        const dx = targetX - player.x;
        const dy = targetY - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
            const speed = player.speed || 750;
            player.vx = (dx / dist) * speed;
            player.vy = (dy / dist) * speed;
            
            player.x += player.vx * deltaTime;
            player.y += player.vy * deltaTime;
            
            // Keep in bounds
            player.x = Math.max(40, Math.min(this.width - 40, player.x));
            player.y = Math.max(40, Math.min(this.height - 40, player.y));
        }
    }
    
    moveToDefensivePosition(player, ownGoal, deltaTime) {
        const isHome = player.team === 'home';
        const defensiveX = isHome ? 300 : this.width - 300;
        let targetY = this.height / 2;
        
        if (player.role === 'LD') targetY = this.height * 0.35;
        if (player.role === 'RD') targetY = this.height * 0.65;
        if (player.role === 'LW') targetY = this.height * 0.25;
        if (player.role === 'RW') targetY = this.height * 0.75;
        
        this.movePlayerTowards(player, defensiveX, targetY, deltaTime);
    }
    
    moveToOffensivePosition(player, opponentGoal, deltaTime) {
        const isHome = player.team === 'home';
        const offensiveX = isHome ? this.width - 350 : 350;
        let targetY = this.height / 2;
        
        if (player.role === 'LW') targetY = this.height * 0.25;
        if (player.role === 'RW') targetY = this.height * 0.75;
        if (player.role === 'C') targetY = this.height * 0.5;
        if (player.role.includes('D')) {
            targetY = player.role === 'LD' ? this.height * 0.35 : this.height * 0.65;
        }
        
        this.movePlayerTowards(player, offensiveX, targetY, deltaTime);
    }
    
    shootPuck(player, target) {
        player.hasPuck = false;
        this.puck.owner = null;
        
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const shotPower = 1500 + (player.shooting || 70) * 10;
        this.puck.vx = (dx / dist) * shotPower;
        this.puck.vy = (dy / dist) * shotPower + (Math.random() - 0.5) * 200;
        this.puck.inAir = true;
        
        // Add shot trail
        this.shotTrails.push({
            startX: player.x,
            startY: player.y,
            endX: target.x,
            endY: target.y,
            life: 1.0,
            color: player.team === 'home' ? '#2563eb' : '#ef4444'
        });
        
        // Increment SOG
        if (player.team === 'home') {
            this.homeSOG++;
        } else {
            this.awaySOG++;
        }
    }
    
    passPuck(player, teammate) {
        player.hasPuck = false;
        
        const dx = teammate.x - player.x;
        const dy = teammate.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const passSpeed = 800;
        this.puck.vx = (dx / dist) * passSpeed;
        this.puck.vy = (dy / dist) * passSpeed;
        this.puck.owner = null;
        
        // Add pass line
        this.passLines.push({
            startX: player.x,
            startY: player.y,
            endX: teammate.x,
            endY: teammate.y,
            life: 1.0
        });
        
        // 30% chance of interception
        const opponents = this.players.filter(p => p.team !== player.team);
        const interceptor = opponents.find(opp => {
            const oppDist = this.distance(opp.x, opp.y, (player.x + teammate.x) / 2, (player.y + teammate.y) / 2);
            return oppDist < 80 && Math.random() < 0.3;
        });
        
        if (interceptor) {
            this.puck.owner = interceptor;
            interceptor.hasPuck = true;
        } else {
            // Schedule pass reception
            setTimeout(() => {
                const stillClose = this.distance(this.puck.x, this.puck.y, teammate.x, teammate.y) < 50;
                if (stillClose && !this.puck.owner) {
                    this.puck.owner = teammate;
                    teammate.hasPuck = true;
                }
            }, 300);
        }
    }
    
    updatePuck(deltaTime) {
        if (this.puck.owner) return;
        
        this.puck.x += this.puck.vx * deltaTime;
        this.puck.y += this.puck.vy * deltaTime;
        
        // Friction
        this.puck.vx *= 0.98;
        this.puck.vy *= 0.98;
        
        // Stop if slow
        if (Math.abs(this.puck.vx) < 10 && Math.abs(this.puck.vy) < 10) {
            this.puck.vx = 0;
            this.puck.vy = 0;
            this.puck.inAir = false;
        }
        
        // Bounce off boards
        if (this.puck.x < 40 || this.puck.x > this.width - 40) {
            this.puck.vx *= -0.6;
            this.puck.x = Math.max(40, Math.min(this.width - 40, this.puck.x));
        }
        if (this.puck.y < 40 || this.puck.y > this.height - 40) {
            this.puck.vy *= -0.6;
            this.puck.y = Math.max(40, Math.min(this.height - 40, this.puck.y));
        }
    }
    
    checkGoals() {
        const homeGoalX = 80;
        const awayGoalX = this.width - 80;
        const goalY = this.height / 2;
        const goalHeight = 100;
        const postRadius = 3; // Round posts
        
        // Check home goal (away scores)
        if (this.puck.x < homeGoalX + 40 && this.puck.inAir) {
            // Check post collisions (round posts)
            const topPostY = goalY - goalHeight / 2;
            const bottomPostY = goalY + goalHeight / 2;
            
            // Top post collision
            const distToTopPost = this.distance(this.puck.x, this.puck.y, homeGoalX, topPostY);
            if (distToTopPost < postRadius + 3) {
                this.handlePostHit(homeGoalX, topPostY);
                return;
            }
            
            // Bottom post collision
            const distToBottomPost = this.distance(this.puck.x, this.puck.y, homeGoalX, bottomPostY);
            if (distToBottomPost < postRadius + 3) {
                this.handlePostHit(homeGoalX, bottomPostY);
                return;
            }
            
            // Crossbar collision (top of net)
            if (Math.abs(this.puck.x - homeGoalX) < 40 && 
                Math.abs(this.puck.y - topPostY) < 5) {
                this.handleCrossbarHit();
                return;
            }
            
            // Check if puck is in goal area
            if (this.puck.x < homeGoalX + 20 && 
                this.puck.y > goalY - goalHeight / 2 && 
                this.puck.y < goalY + goalHeight / 2) {
                
                const goalie = this.goalies.find(g => g.team === 'home');
                const saveChance = (goalie.saveRating || 75) / 100;
                
                if (Math.random() > saveChance) {
                    // GOAL! Hit the net and stopped
                    this.handleGoalScored('away', homeGoalX, this.puck.y);
                } else {
                    // SAVE!
                    this.handleSave('home');
                }
            }
        }
        
        // Check away goal (home scores)
        if (this.puck.x > awayGoalX - 40 && this.puck.inAir) {
            // Check post collisions (round posts)
            const topPostY = goalY - goalHeight / 2;
            const bottomPostY = goalY + goalHeight / 2;
            
            // Top post collision
            const distToTopPost = this.distance(this.puck.x, this.puck.y, awayGoalX, topPostY);
            if (distToTopPost < postRadius + 3) {
                this.handlePostHit(awayGoalX, topPostY);
                return;
            }
            
            // Bottom post collision
            const distToBottomPost = this.distance(this.puck.x, this.puck.y, awayGoalX, bottomPostY);
            if (distToBottomPost < postRadius + 3) {
                this.handlePostHit(awayGoalX, bottomPostY);
                return;
            }
            
            // Crossbar collision
            if (Math.abs(this.puck.x - awayGoalX) < 40 && 
                Math.abs(this.puck.y - topPostY) < 5) {
                this.handleCrossbarHit();
                return;
            }
            
            // Check if puck is in goal area
            if (this.puck.x > awayGoalX - 20 && 
                this.puck.y > goalY - goalHeight / 2 && 
                this.puck.y < goalY + goalHeight / 2) {
                
                const goalie = this.goalies.find(g => g.team === 'away');
                const saveChance = (goalie.saveRating || 75) / 100;
                
                if (Math.random() > saveChance) {
                    // GOAL! Hit the net and stopped
                    this.handleGoalScored('home', awayGoalX, this.puck.y);
                } else {
                    // SAVE!
                    this.handleSave('away');
                }
            }
        }
    }
    
    handlePostHit(postX, postY) {
        // Realistic post physics - angle of incidence = angle of reflection
        const dx = this.puck.x - postX;
        const dy = this.puck.y - postY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize
        const nx = dx / dist;
        const ny = dy / dist;
        
        // Reflect velocity (elastic collision with round post)
        const dot = this.puck.vx * nx + this.puck.vy * ny;
        this.puck.vx = this.puck.vx - 2 * dot * nx;
        this.puck.vy = this.puck.vy - 2 * dot * ny;
        
        // Reduce speed slightly (energy loss)
        this.puck.vx *= 0.8;
        this.puck.vy *= 0.8;
        
        // Visual/audio feedback
        this.postHitFlash = 0.3;
        this.gameEvents.push({ type: 'post', time: this.gameTime });
    }
    
    handleCrossbarHit() {
        // Crossbar hit - puck bounces down
        this.puck.vy = Math.abs(this.puck.vy) * 0.7; // Bounce down with energy loss
        this.puck.vx *= 0.8;
        
        this.crossbarHitFlash = 0.3;
        this.gameEvents.push({ type: 'crossbar', time: this.gameTime });
    }
    
    handleGoalScored(team, netX, netY) {
        // Puck hits net mesh and stops (realistic net physics)
        // Net mesh catches the puck 90% of the time
        const netCatches = Math.random() < 0.9;
        
        if (netCatches) {
            // Puck caught in net - comes to rest
            this.puck.vx = 0;
            this.puck.vy = 0;
            this.puck.x = netX + (team === 'home' ? -15 : 15);
            this.puck.y = netY;
        } else {
            // Rare: puck bounces back out of net (soft mesh)
            this.puck.vx = team === 'home' ? 150 : -150;
            this.puck.vy = (Math.random() - 0.5) * 100;
        }
        
        // Score the goal
        if (team === 'home') {
            this.homeScore++;
            this.momentum += 20;
        } else {
            this.awayScore++;
            this.momentum -= 20;
        }
        
        this.celebrationTimer = 3;
        this.gameEvents.push({ type: 'goal', team, time: this.gameTime });
        
        // Delay faceoff slightly for goal celebration
        setTimeout(() => this.faceoff(), 100);
    }
    
    handleSave(team) {
        this.saveFlashTimer = 0.5;
        
        // Rebound direction based on which team's goalie made save
        const reboundDirection = team === 'home' ? 1 : -1;
        this.puck.vx = 200 * reboundDirection;
        this.puck.vy = (Math.random() - 0.5) * 400;
        this.puck.inAir = false;
    }
    
    callPenalty() {
        const team = Math.random() < 0.5 ? 'home' : 'away';
        this.isPowerPlay = true;
        this.powerPlayTeam = team === 'home' ? 'away' : 'home';
        this.powerPlayTime = 120;
        this.gameEvents.push({ type: 'penalty', team, time: this.gameTime });
    }
    
    updateMomentum(deltaTime) {
        // Decay toward 0
        if (this.momentum > 0) {
            this.momentum = Math.max(0, this.momentum - deltaTime * 2);
        } else {
            this.momentum = Math.min(0, this.momentum + deltaTime * 2);
        }
        this.momentum = Math.max(-100, Math.min(100, this.momentum));
    }
    
    faceoff() {
        this.puck.x = this.width / 2;
        this.puck.y = this.height / 2;
        this.puck.vx = 0;
        this.puck.vy = 0;
        this.puck.owner = null;
        this.puck.inAir = false;
        
        this.players.forEach(p => p.hasPuck = false);
    }
    
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    render() {
        // Draw rink
        this.drawRink();
        
        // Draw visual effects
        this.drawPassLines();
        this.drawShotTrails();
        
        // Draw players
        this.players.forEach(p => this.drawPlayer(p));
        this.goalies.forEach(g => this.drawPlayer(g));
        
        // Draw puck
        this.drawPuck();
        
        // Draw score bug
        this.drawScoreBug();
        
        // Draw celebration
        if (this.celebrationTimer > 0) {
            this.drawCelebration();
        }
        
        // Draw save flash
        if (this.saveFlashTimer > 0) {
            this.drawSaveFlash();
        }
        
        // Draw power play indicator
        if (this.isPowerPlay) {
            this.drawPowerPlayIndicator();
        }
    }
    
    drawRink() {
        // Ice surface
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#e8f4f8');
        gradient.addColorStop(0.5, '#f0f8ff');
        gradient.addColorStop(1, '#e8f4f8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Boards
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(30, 30, this.width - 60, this.height - 60);
        
        this.ctx.strokeStyle = '#c41e3a';
        this.ctx.lineWidth = 4;
        
        // Goal lines
        this.ctx.beginPath();
        this.ctx.moveTo(100, 30);
        this.ctx.lineTo(100, this.height - 30);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.width - 100, 30);
        this.ctx.lineTo(this.width - 100, this.height - 30);
        this.ctx.stroke();
        
        // Blue lines
        this.ctx.strokeStyle = '#003da5';
        this.ctx.lineWidth = 5;
        
        const leftBlue = this.width * 0.3;
        const rightBlue = this.width * 0.7;
        
        this.ctx.beginPath();
        this.ctx.moveTo(leftBlue, 30);
        this.ctx.lineTo(leftBlue, this.height - 30);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(rightBlue, 30);
        this.ctx.lineTo(rightBlue, this.height - 30);
        this.ctx.stroke();
        
        // Red center line
        this.ctx.strokeStyle = '#c41e3a';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 30);
        this.ctx.lineTo(this.width / 2, this.height - 30);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.strokeStyle = '#003da5';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, 60, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Face-off dots
        this.ctx.fillStyle = '#c41e3a';
        const dotRadius = 8;
        const dots = [
            // Center
            { x: this.width / 2, y: this.height / 2 },
            // Left zone
            { x: leftBlue - 100, y: this.height * 0.35 },
            { x: leftBlue - 100, y: this.height * 0.65 },
            // Right zone
            { x: rightBlue + 100, y: this.height * 0.35 },
            { x: rightBlue + 100, y: this.height * 0.65 }
        ];
        dots.forEach(dot => {
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Goal creases
        this.drawGoalCrease(80, this.height / 2);
        this.drawGoalCrease(this.width - 80, this.height / 2);
    }
    
    drawGoalCrease(x, y) {
        this.ctx.fillStyle = 'rgba(196, 30, 58, 0.2)';
        this.ctx.strokeStyle = '#c41e3a';
        this.ctx.lineWidth = 2;
        
        const creaseWidth = 40;
        const creaseHeight = 80;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, creaseHeight / 2, -Math.PI / 2, Math.PI / 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Goal posts
        this.ctx.fillStyle = '#c41e3a';
        this.ctx.beginPath();
        this.ctx.arc(x, y - creaseHeight / 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x, y + creaseHeight / 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPlayer(player) {
        const color = player.team === 'home' ? '#2563eb' : '#ef4444';
        const size = player.goalie ? 16 : 12;
        
        // Player circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Role text
        if (!player.goalie) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 9px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(player.role, player.x, player.y);
        } else {
            this.ctx.fillText('G', player.x, player.y);
        }
    }
    
    drawPuck() {
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(this.puck.x, this.puck.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawShotTrails() {
        this.shotTrails.forEach(trail => {
            this.ctx.strokeStyle = trail.color;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = trail.life * 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(trail.startX, trail.startY);
            this.ctx.lineTo(trail.endX, trail.endY);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawPassLines() {
        this.passLines.forEach(line => {
            this.ctx.strokeStyle = '#06b6d4';
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = line.life * 0.6;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(line.startX, line.startY);
            this.ctx.lineTo(line.endX, line.endY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawScoreBug() {
        const bugHeight = 60;
        const bugWidth = 300;
        const x = (this.width - bugWidth) / 2;
        const y = 10;
        
        // Background
        const gradient = this.ctx.createLinearGradient(x, y, x, y + bugHeight);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, bugWidth, bugHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, bugWidth, bugHeight);
        
        // Teams and scores
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Home team
        this.ctx.fillStyle = '#2563eb';
        this.ctx.fillText(this.homeTeam.name.substring(0, 10), x + 10, y + 8);
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(this.homeScore, x + 10, y + 28);
        
        // Away team
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = '#ef4444';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(this.awayTeam.name.substring(0, 10), x + bugWidth - 10, y + 8);
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(this.awayScore, x + bugWidth - 10, y + 28);
        
        // Period and time (center)
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.fillText(`${this.getOrdinal(this.period)} Period`, x + bugWidth / 2, y + 10);
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(this.formatTime(this.gameTime), x + bugWidth / 2, y + 28);
        
        // SOG
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SOG: ${this.homeSOG}`, x + 10, y + 52);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`SOG: ${this.awaySOG}`, x + bugWidth - 10, y + 52);
    }
    
    drawCelebration() {
        const alpha = Math.sin(this.celebrationTimer * 5) * 0.3 + 0.3;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.celebrationTimer > 2) {
            this.ctx.save();
            this.ctx.font = 'bold 100px Arial';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 6;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const text = 'GOAL!';
            this.ctx.strokeText(text, this.width / 2, this.height / 2);
            this.ctx.fillText(text, this.width / 2, this.height / 2);
            this.ctx.restore();
        }
    }
    
    drawSaveFlash() {
        const alpha = this.saveFlashTimer;
        this.ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.3})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawPowerPlayIndicator() {
        this.ctx.save();
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        const ppText = `POWER PLAY - ${Math.ceil(this.powerPlayTime)}s`;
        this.ctx.strokeText(ppText, this.width / 2, 85);
        this.ctx.fillText(ppText, this.width / 2, 85);
        this.ctx.restore();
    }
    
    updateUI() {
        const homeScoreEl = document.getElementById('home-score');
        const awayScoreEl = document.getElementById('away-score');
        const periodEl = document.getElementById('period-display');
        const clockEl = document.getElementById('game-clock');
        
        if (homeScoreEl) homeScoreEl.textContent = this.homeScore;
        if (awayScoreEl) awayScoreEl.textContent = this.awayScore;
        if (periodEl) periodEl.textContent = this.getOrdinal(this.period);
        if (clockEl) clockEl.textContent = this.formatTime(this.gameTime);
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
