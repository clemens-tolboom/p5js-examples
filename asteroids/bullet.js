class Bullet extends SpaceObject {

    constructor(position, direction, speed) {
        super(position);

        this.size = 5;

        this.velocity = createVector(speed, 0);
        this.velocity.rotate(direction + 90);
    }

    update() {
        super.update();
    }

    draw() {
        color(255,0,0);
        fill(255,0,0);
        noStroke();
        ellipse(this.position.x, this.position.y, this.size, this.size);
        stroke(100);
        line(this.position.x,
            this.position.y,
            this.position.x - this.velocity.x * 10,
            this.position.y - 10 * this.velocity.y);
    }
}