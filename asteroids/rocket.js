class Rocket extends SpaceObject {
    constructor(position) {
        super(position);

        this.size = 30;

        this.heading = createVector(0, -1);
        this.rotation = 180.0;
        this.rotationSpeed = 2;

        this.bulletDelay = 100;
        this.bulletLastFired = 0;

        this.position = position.copy();

        this.scanRange = 400;
        this.radar = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    rotate(direction) {
        if (direction > 0) {
            this.rotation += this.rotationSpeed;
        }
        if (direction < 0) {
            this.rotation -= this.rotationSpeed;
        }
        this.heading.x = -sin(this.rotation);
        this.heading.y = cos(this.rotation);
    }

    inRange(spaceObject) {
        var dist = this.position.dist(spaceObject.position);
        //console.log(dist);
        if (dist < spaceObject.radius / 2) {
            return true;
        }
        return false;
    }

    thrust(power) {
        let newVector = createVector(0.1 * power, 0);
        newVector.rotate(this.rotation + 90);
        this.acceleration.add(newVector);
    }

    canFire() {
        return this.bulletLastFired <= 0;
    }

    fire() {
        if (this.canFire()) {
            let bullet = new Bullet(this.position, this.rotation, 5);

            this.bulletLastFired = this.bulletDelay;
            return bullet;
        }
    }

    run() {
        this.update();
        this.display();
    }

    radarTest(spaceObject) {
        if (!spaceObject) {
            this.radar = [0, 0, 0, 0, 0, 0, 0, 0];
            return;
        }
        // Check for distance
        var direction = p5.Vector.sub(spaceObject.position, this.position);
        var dist = direction.mag();
        if (dist < this.scanRange) {
            // What sector is it?
            var angle = direction.angleBetween(this.heading);
            // Negative z means left, positive right
            var cross = this.heading.cross(direction);
            var cross_z = cross.z;
            // Compass sectors
            var sector = 'S';
            var delta = 45.0 / 2;
            if (angle < delta) {
                sector = 'N';
            } else if (angle < 3 * delta) {
                if (cross_z < 0) {
                    sector = "NW";
                }
                else {
                    sector = 'NE';
                }
            } else if (angle < 5 * delta) {
                if (cross_z < 0) {
                    sector = "W";
                }
                else {
                    sector = 'E';
                }
            } else if (angle < 7 * delta) {
                if (cross_z < 0) {
                    sector = "SW";
                }
                else {
                    sector = 'SE';
                }
            }

            switch (sector) {
                case 'N':
                    this.radar[0] = 1;
                    break;
                case 'NE':
                    this.radar[1] = 1;
                    break;
                case 'E':
                    this.radar[2] = 1;
                    break;
                case 'SE':
                    this.radar[3] = 1;
                    break;
                case 'S':
                    this.radar[4] = 1;
                    break;
                case 'SW':
                    this.radar[5] = 1;
                    break;
                case 'W':
                    this.radar[6] = 1;
                    break;
                case 'NW':
                    this.radar[7] = 1;
                    break;
                default:
                    break;
            }

            return sector;
        }
    }

    update() {
        super.update();

        this.lifespan -= 2;

        super.wrapScreen();

        this.bulletLastFired--;
    }

    display() {
        let x = this.position.x;
        let y = this.position.y;

        stroke(255);
        fill(255)

        line(x, y, 50 * this.heading.x + x, 50 * this.heading.y + y);

        stroke(0, 255, 0);
        line(x, y, 25 * this.velocity.x + x, 25 * this.velocity.y + y);

        fill(0, 255, 0);
        push();

        translate(x, y);
        rotate(this.rotation);
        quad(-2, 0, 2, 0, 8, -30, -8, -30);

        // Radar
        rotate(45 * 1.5);
        for (var i = 0; i < 8; i++) {
            // stroke(255 - i * 16);
            // line(0, 0, this.scanRange, 0);
            if (this.radar[i] > 0) {
                noStroke();
                fill(255, 0, 0, 40);
                triangle(0, 0, this.scanRange / 4, 0, 0.7 * this.scanRange / 4, 0.7 * this.scanRange / 4);

            }
            rotate(45);
        }

        pop();


    }

}