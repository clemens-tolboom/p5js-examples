let circles = [];

class Circle {
  constructor() {
    this.r = random(10, 150);

    let v = p5.Vector.random2D();
    v.x = random(width - this.r) + this.r / 2;
    v.y = random(height - this.r) + this.r / 2;
    this.p = v;
  }

  draw() {
    circle(this.p.x, this.p.y, this.r);
  }
}


function setup() {
  //randomSeed(99);

  createCanvas(800, 800);
  background(0);
  for (let i = 0; i < 10; i++) {
    circles.push(new Circle());
  }
}

function restart() {
}

function draw() {
  circles.forEach(function (v, i, a) {
    v.draw();
  });
}