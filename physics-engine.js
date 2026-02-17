// Physics Engine for Hockey Game Simulation
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
}

class PhysicsBody {
    constructor(x, y, radius, mass = 1) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.radius = radius;
        this.mass = mass;
        this.friction = 0.98;
    }

    applyForce(force) {
        const acceleration = force.multiply(1 / this.mass);
        this.velocity = this.velocity.add(acceleration);
    }

    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.velocity = this.velocity.multiply(this.friction);
    }
}

class Player extends PhysicsBody {
    constructor(x, y, team, role) {
        super(x, y, 12, 85); // radius 12px, mass 85kg
        this.team = team; // 'home' or 'away'
        this.role = role; // 'C', 'LW', 'RW', 'LD', 'RD', 'G'
        this.hasPuck = false;
        this.speed = 150; // pixels per second
    }

    skateTowards(target, deltaTime) {
        const direction = target.subtract(this.position).normalize();
        const force = direction.multiply(this.speed);
        this.velocity = force.multiply(deltaTime);
    }
}

class Puck extends PhysicsBody {
    constructor(x, y) {
        super(x, y, 5, 0.17); // radius 5px, mass 0.17kg
        this.owner = null;
        this.friction = 0.96;
    }
}

class PhysicsEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rinkBounds = {
            minX: 25,
            maxX: width - 25,
            minY: 25,
            maxY: height - 25
        };
    }

    update(players, puck, goalies, deltaTime) {
        // Update all entities
        players.forEach(player => player.update(deltaTime));
        goalies.forEach(goalie => goalie.update(deltaTime));
        puck.update(deltaTime);

        // Keep entities within bounds
        this.constrainToBounds(players, goalies, puck);

        // Check collisions
        this.checkCollisions(players, goalies, puck);
    }

    constrainToBounds(players, goalies, puck) {
        const allEntities = [...players, ...goalies, puck];
        allEntities.forEach(entity => {
            if (entity.position.x - entity.radius < this.rinkBounds.minX) {
                entity.position.x = this.rinkBounds.minX + entity.radius;
                entity.velocity.x *= -0.5;
            }
            if (entity.position.x + entity.radius > this.rinkBounds.maxX) {
                entity.position.x = this.rinkBounds.maxX - entity.radius;
                entity.velocity.x *= -0.5;
            }
            if (entity.position.y - entity.radius < this.rinkBounds.minY) {
                entity.position.y = this.rinkBounds.minY + entity.radius;
                entity.velocity.y *= -0.5;
            }
            if (entity.position.y + entity.radius > this.rinkBounds.maxY) {
                entity.position.y = this.rinkBounds.maxY - entity.radius;
                entity.velocity.y *= -0.5;
            }
        });
    }

    checkCollisions(players, goalies, puck) {
        const allPlayers = [...players, ...goalies];

        // Check puck-player collisions
        allPlayers.forEach(player => {
            const distance = player.position.subtract(puck.position).length();
            if (distance < player.radius + puck.radius + 10) {
                if (!puck.owner) {
                    puck.owner = player;
                    player.hasPuck = true;
                }
            }
        });

        // Check player-player collisions
        for (let i = 0; i < allPlayers.length; i++) {
            for (let j = i + 1; j < allPlayers.length; j++) {
                this.resolveCollision(allPlayers[i], allPlayers[j]);
            }
        }
    }

    resolveCollision(bodyA, bodyB) {
        const delta = bodyB.position.subtract(bodyA.position);
        const distance = delta.length();
        const minDistance = bodyA.radius + bodyB.radius;

        if (distance < minDistance && distance > 0) {
            const normal = delta.normalize();
            const overlap = minDistance - distance;
            
            // Separate bodies
            const separation = normal.multiply(overlap / 2);
            bodyA.position = bodyA.position.subtract(separation);
            bodyB.position = bodyB.position.add(separation);

            // Elastic collision response
            const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
            const velocityAlongNormal = relativeVelocity.dot(normal);

            if (velocityAlongNormal < 0) return;

            const restitution = 0.4;
            const impulse = -(1 + restitution) * velocityAlongNormal;
            const impulseDivided = impulse / (bodyA.mass + bodyB.mass);

            const impulseVector = normal.multiply(impulse);
            bodyA.velocity = bodyA.velocity.subtract(impulseVector.multiply(1 / bodyA.mass));
            bodyB.velocity = bodyB.velocity.add(impulseVector.multiply(1 / bodyB.mass));
        }
    }

    checkGoal(puck, homeGoalArea, awayGoalArea) {
        // Check if puck is in goal
        const puckX = puck.position.x;
        const puckY = puck.position.y;

        if (this.isInGoal(puckX, puckY, homeGoalArea)) {
            return 'away'; // Away team scored
        }
        if (this.isInGoal(puckX, puckY, awayGoalArea)) {
            return 'home'; // Home team scored
        }
        return null;
    }

    isInGoal(x, y, goalArea) {
        return x >= goalArea.x &&
               x <= goalArea.x + goalArea.width &&
               y >= goalArea.y &&
               y <= goalArea.y + goalArea.height;
    }
}
