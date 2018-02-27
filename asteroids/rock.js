class Rock extends SpaceObject {
    constructor(position, direction, speed, size) {
        super(position);

        this.direction = direction;
        this.velocity = createVector(speed, 0);
        this.velocity.rotate(direction + 90);
        this.size = size;
        this.radius = 40 * size / 2;

        this.destroyed = false;
    }

    reduce() {
      this.size /= 2;
      this.radius /= 2;
    }

    update() {
        super.update();

        super.wrapScreen(this.size, this.size);
    }

    inRange(spaceObject) {
        var dist = this.position.dist(spaceObject.position)
        return dist < this.radius/2;
    }

    hit() {
        if (this.size > 1) {
            console.log('Rock split');
            this.reduce();

            var rock = new Rock(this.position.copy(), this.direction - 45, this.velocity.mag() * 2, this.size);
            this.velocity.rotate(+45);
            return rock;
        }
        this.active = false;
    }


    draw() {
        if (this.isActive()) {
            fill(128, 128, 128);
        } else {
            fill(255, 0, 0);
        }
        noStroke();
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
    }

}