class SpaceObject {

    constructor(position) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.position = position.copy();
        this.active = true;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.position.add(this.velocity);
    }

    isActive() {
        return this.active;
    }

    offScreen() {
        return (this.position.x < -10 || this.position.x > width + 10)
            || (this.position.y < -10 || this.position.y > height + 10);
    }

    wrapScreen() {
        if (this.position.x < 0) {
            this.position.x += width;
        }
        else if (this.position.x > width) {
            this.position.x -= width;
        }

        if (this.position.y < 0) {
            this.position.y += height;
        }
        else if (this.position.y > height) {
            this.position.y -= height;
        }
    }
}