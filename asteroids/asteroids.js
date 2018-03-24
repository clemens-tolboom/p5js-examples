/**
 * Asteroids is the game engine.
 *
 * It manages
 * - 1 Spaceship aka the player
 * - Rocks aka the passive enemies.
 * - Bullets fired bij de spaceship.
 *
 * It checks for the amount of bullets.
 *
 * It provides inputs and outputs making it controllable by an AI.
 */
class Asteroids {
    /**
     * Create the game arena with Spaceship, Rocks.
     *
     * @param ps.Vector2D position
     *   The position of the spaceship.
     * TODO: remove position
     */
    constructor(position) {
        this.origin = position.copy();

        this.rocks = [];
        this.rockScore = 100;

        this.timeScore = 1;

        this.bullets = [];
        this.maxBullets = 500;
        this.bulletReloadTime = 2;
        this.bullerCost = 1;

        this.isAI = false;

        this.rockStart = 10;

        this.massInRocks = 0;
        for (var i = 0; i < this.rockStart; i++) {
            var rock = this.randomRock();
            this.massInRocks+= rock.size * rock.size;
            this.rocks.push(rock);
        }
        this.massLeft = this.massInRocks;

        this.inputs = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            space: 0
        };

        this.outputs = {
            // range: 0 -
            score: 100,
            canFire: 1,
            // range: this.rockStart - 0
            rocks: 0,
            // range: 0 -
            mass: 0,
            // range: 0 - 1
            dead: 0,
            won: 0,
            // thread directions; range element Array(8) : -255 - 255
            // TODO: fix for range: [-255,255] threat values
            radar: [],
        };
        this.spaceship = new Spaceship(createVector(width / 2, height / 2));
        this.spaceship.bulletDelay = this.bulletReloadTime;

    }

    gameOver() {
        return this.outputs.dead || this.outputs.won;
    }

    randomRock() {
        return new Rock(this.origin, random(360), random(2), random([1, 2, 4, 8]));
    }

    update() {

        if (keyIsDown(48)) {
            this.setup('one-rocks');
        } else if (keyIsDown(49)) {
            this.setup('add-rock');
        } else if (keyIsDown(50)) {
            this.setup('add-moving-rock');
        }

        if (!this.isAI) {
            this.inputs.left = keyIsDown(LEFT_ARROW) ? 1 : 0;
            this.inputs.right = keyIsDown(RIGHT_ARROW) ? 1 : 0;
            this.inputs.up = keyIsDown(UP_ARROW) ? 1 : 0;
            this.inputs.down = keyIsDown(DOWN_ARROW) ? 1 : 0;
            this.inputs.space = keyIsDown(32) ? 1 : 0;
        }

        if (this.inputs.left !== this.inputs.right) {
            if (this.inputs.left) {
                this.spaceship.rotate(-1);
            }
            else {
                this.spaceship.rotate(1);
            }
        }

        if (this.inputs.up !== this.inputs.down) {
            if (this.inputs.up) {
                this.spaceship.thrust(1);
            }
            else {
                this.spaceship.thrust(-1);
            }
        }

        if (this.inputs.space) {
            if (this.canFire()) {
                this.bullets.push(this.spaceship.fire());
                this.outputs.score -= this.bullerCost;
            }
        }

        for (var bullet of this.bullets) {
            bullet.update();
        }

        this.bullets = this.bullets.filter((bullet) => !bullet.offScreen());

        this.bullets = this.bullets.filter((bullet) => bullet.isActive());
        this.rocks = this.rocks.filter((rock) => rock.isActive());

        this.spaceship.radarTest();
        for (var rock of this.rocks) {
            rock.update();
            this.spaceship.radarTest(rock);
            for (var bullet of this.bullets) {

                if (rock.inRange(bullet)) {
                    bullet.active = false;
                    var newRock = rock.hit();
                    this.outputs.score += this.rockScore;
                    if (newRock) {
                        this.rocks.push(newRock);
                    }
                }
            }
        }

        this.massLeft = 0;
        for (var rock of this.rocks) {
            this.massLeft+= rock.size * rock.size;
            if (this.spaceship.inRange(rock)) {
                this.spaceship.active = false;
            }
        }

        if (this.spaceship.isActive()) {
            this.spaceship.update();
        }

        this.outputs.dead = 1 * !this.spaceship.isActive();
        this.outputs.rocks = this.rocks.length;
        this.outputs.won = this.rocks.length === 0 ? 1 : 0;
        this.outputs.canFire = (this.spaceship.canFire() ? 1 : 0);
        this.outputs.radar = this.spaceship.radar;
        this.outputs.score += this.timeScore;
        this.outputs.mass = Math.floor(100* (this.massInRocks - this.massLeft) / this.massInRocks);

    }

    draw() {
        for (var bullet of this.bullets) {
            bullet.draw();
        }

        for (var rock of this.rocks) {
            rock.draw();
        }

        this.spaceship.display();

        this.drawState();

    }

    /**
     * Only fire when have enough money and spaceship has reloaded.
     * @returns {boolean}
     */
    canFire() {
        return this.bullets.length < this.maxBullets
            && this.outputs.score > this.bullerCost
            && this.spaceship.canFire();
    }

    drawState() {

        let scaleX = 16;
        let scaleY = 16;

        noStroke();

        textSize(height / scaleY);

        if (!this.spaceship.isActive()) {
            fill(128, 0, 0, 90);
            rect(0, 0, width, height);

            fill(255, 0, 0, 90);

            textAlign(CENTER);
            text("Game over", width / 2, height / 2);
        }
        else if (this.outputs.won) {
            fill(128, 0, 0, 90);
            rect(0, 0, width, height);

            fill(255, 0, 0, 90);

            textAlign(CENTER);
            text("You won!!!", width / 2, height / 2);

        }

        textSize(height / scaleY / 2);

        textAlign(LEFT);

        fill(255, 196, 196, 90);
        rect(0, height - 2 * height / scaleY, width, height);

        let textBottom = height - 1.5 * height / scaleY;
        if (this.isAI) {
            text('AI: Up: ' + this.inputs.up, 10, textBottom);
        }
        else {
            text('Up: ' + this.inputs.up, 10, textBottom);
        }
        text('Down: ' + this.inputs.down, 1 / 5 * width, textBottom);
        text('Left: ' + this.inputs.left, 2 / 5 * width, textBottom);
        text('Right: ' + this.inputs.right, 3 / 5 * width, textBottom);
        text('Space: ' + this.inputs.space, 4 / 5 * width, textBottom);


        fill(128, 128, 128, 80);
        rect(0, height - height / scaleY, width, height);
        fill(255);

        textBottom = height - height / scaleY / 2;
        text('Can fire: ' + this.outputs.canFire, 10, textBottom);
        text('Mass: ' + this.outputs.mass, 1 / 5 * width, textBottom);
        text('Score: ' + this.outputs.score, 2 / 5 * width, textBottom);
        text('Rocks: ' + this.outputs.rocks, 3 / 5 * width, textBottom);
        text('Radar: ' + this.outputs.radar.join(','), 4 / 5 * width, textBottom);

    }

    setup(key) {
        switch (key) {
            case "one-rocks":
                this.rocks = [];
                this.setup('add-rock');
                break;
            case "add-rock":
                var rock = this.randomRock();
                rock.velocity.mult(0);
                this.rocks.push(rock);
                break;
            case "add-moving-rock":
                var rock = this.randomRock();
                this.rocks.push(rock);
                break;
            default:
                break;
        }

    }
}
