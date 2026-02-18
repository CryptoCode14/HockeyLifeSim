// AI Controller for Hockey Players
class AIController {
    constructor(player, rinkWidth, rinkHeight) {
        this.player = player;
        this.rinkWidth = rinkWidth;
        this.rinkHeight = rinkHeight;
        this.targetPosition = null;
        this.decisionTimer = 0;
        this.decisionInterval = 0.5; // Make decisions every 0.5 seconds
    }

    update(puck, allPlayers, deltaTime) {
        this.decisionTimer += deltaTime;
        
        if (this.decisionTimer >= this.decisionInterval) {
            this.makeDecision(puck, allPlayers);
            this.decisionTimer = 0;
        }

        // Execute current action
        if (this.targetPosition) {
            this.player.skateTowards(this.targetPosition, deltaTime);
        }

        // If player has puck, carry it
        if (this.player.hasPuck && puck.owner === this.player) {
            puck.position = this.player.position.add(new Vector2(15, 0));
            puck.velocity = new Vector2(0, 0);
        }
    }

    makeDecision(puck, allPlayers) {
        const isHomeTeam = this.player.team === 'home';
        const ownGoal = isHomeTeam ? 
            new Vector2(80, this.rinkHeight / 2) : 
            new Vector2(this.rinkWidth - 80, this.rinkHeight / 2);
        const opponentGoal = isHomeTeam ? 
            new Vector2(this.rinkWidth - 80, this.rinkHeight / 2) : 
            new Vector2(80, this.rinkHeight / 2);

        // Goalie behavior
        if (this.player.role === 'G') {
            this.goalieAI(puck, ownGoal);
            return;
        }

        // If we have the puck
        if (this.player.hasPuck) {
            this.offensiveAI(puck, opponentGoal, allPlayers);
        } else {
            // If teammate has puck, support offense
            const teammateHasPuck = allPlayers.some(p => 
                p.team === this.player.team && p.hasPuck
            );
            
            if (teammateHasPuck) {
                this.supportOffense(opponentGoal);
            } else {
                // Chase the puck or play defense
                this.defensiveAI(puck, ownGoal);
            }
        }
    }

    goalieAI(puck, ownGoal) {
        // Stay near goal and track puck vertically
        const targetY = Math.max(
            ownGoal.y - 60,
            Math.min(ownGoal.y + 60, puck.position.y)
        );
        this.targetPosition = new Vector2(ownGoal.x, targetY);
    }

    offensiveAI(puck, opponentGoal, allPlayers) {
        const distanceToGoal = this.player.position.subtract(opponentGoal).length();
        
        // If close enough and clear shot, shoot
        if (distanceToGoal < 300 && Math.random() < 0.15) {
            this.shoot(puck, opponentGoal);
        } else {
            // Move towards goal
            this.targetPosition = opponentGoal;
        }
    }

    defensiveAI(puck, ownGoal) {
        // Chase the puck if it's close, otherwise position defensively
        const distanceToPuck = this.player.position.subtract(puck.position).length();
        
        if (distanceToPuck < 200) {
            this.targetPosition = puck.position;
        } else {
            // Position between puck and own goal
            const defensiveX = (puck.position.x + ownGoal.x) / 2;
            const defensiveY = (puck.position.y + ownGoal.y) / 2;
            this.targetPosition = new Vector2(defensiveX, defensiveY);
        }
    }

    supportOffense(opponentGoal) {
        // Move to open space near opponent's goal
        const offset = this.player.role === 'LW' ? -100 : 
                      this.player.role === 'RW' ? 100 : 0;
        this.targetPosition = new Vector2(
            opponentGoal.x - 150,
            this.rinkHeight / 2 + offset
        );
    }

    shoot(puck, target) {
        // Release puck and shoot towards goal
        this.player.hasPuck = false;
        puck.owner = null;
        
        const direction = target.subtract(puck.position).normalize();
        const shootPower = 400 + Math.random() * 200; // Random shot power
        
        // Add some inaccuracy
        const accuracy = 0.9;
        const inaccuracy = (Math.random() - 0.5) * (1 - accuracy);
        const shootDirection = new Vector2(
            direction.x + inaccuracy,
            direction.y + inaccuracy
        ).normalize();
        
        puck.velocity = shootDirection.multiply(shootPower);
    }

    pass(puck, teammate) {
        this.player.hasPuck = false;
        puck.owner = null;
        
        const direction = teammate.position.subtract(puck.position).normalize();
        puck.velocity = direction.multiply(250);
    }
}
