class Snake {
    constructor(x, y) {
        this.start = createVector(x, y);
        this.reset();
    }

    reset() {
        this.segments = [createVector(this.start.x, this.start.y)];
        this.speed = createVector(1, 0);
        this.size = size;
        this.dead = 0;
    }

    draw() {
        stroke(0);
        fill(255, 0, 0);
        this.segments.forEach(p => {
            rect(size * (p.x + 1), size * (p.y + 1), this.size, this.size);
            fill(255, 255, 0);
        });
    }

    update() {
        if (this.dead > 0) {
            this.dead--;
            if (this.dead === 0) {
                this.reset();
            }
            return;
        }

        let head = this.segments[0];
        let next = createVector(head.x, head.y);
        next.add(this.speed);

        if (walls.hitTest(next)) {
            this.dead = 10;
        }
        else {
            this.segments.unshift(next);
        }

        let tail = this.segments.pop();
        if (food.hit(next)) {
            this.segments.push(tail);
            food.spawn();
        }
        else {
            if (this.segments.length < 100) {
                this.segments.push(tail);
            }
        }
    }

    right() {
        this.speed.rotate(PI / 2);
    }

    left() {
        this.speed.rotate(-PI / 2);
    }

    hit() {

    }
}
