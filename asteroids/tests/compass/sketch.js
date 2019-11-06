/**
 * https://www.youtube.com/watch?v=1o4naC4P8-M
 *
 * https://github.com/Code-Bullet/AsteroidsAI
 *
 * http://keycode.info/
 */


class Compass {
    constructor(n, r) {
        this.n = n;
        this.r = r;

        let angle = TWO_PI / n;
        let rotate = -angle / 2 - HALF_PI;

        this.x = [];
        this.y = [];
        this.a = [];

        for (let i = 0; i < n; i++) {
            var a = (rotate + i * angle);
            this.x.push(r * Math.cos(a));
            this.y.push(r * Math.sin(a));
            this.a.push(a);
        }
    }

    update() {
    }

    draw() {
        translate(width / 2, height / 2);

        fill(255, 0, 0);
        for (let i = 1; i < this.n; i++) {
            fill(i / this.n * 255, 255, 0);
            arc(0, 0, this.r, this.r, this.a[i - 1], this.a[i], PIE);
        }
        fill(255, 0, 0);
        arc(0, 0, this.r, this.r, this.a[this.n - 1], this.a[0], PIE);

    }
}

let game;

function setup() {
    angleMode(DEGREES);

    createCanvas(1024, 800);

    game = new Compass(3, 50);
}

function draw() {
    game.update();
    game.draw();
}
