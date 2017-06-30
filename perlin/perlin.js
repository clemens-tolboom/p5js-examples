var fr;
var particles = [];

function setup() {
  grid = 20;
  createCanvas(1200, 900, P2D);
  background(255);
  z = 0.0;

  pStep = 0.004;
  fr = createP('');

  for (var i = 0; i < 200; i++) {
    particles[i] = new Particle( random(width), random(height));
  }
  background(255);
}

function draw() {
  if (false) {
    colorMode(RGB);
    color(0);
    background(255);
    strokeWeight(0);
    for (var x= 0; x < width; x += grid) {
      for (var y= 0; y < height; y+= grid) {
        strokeWeight(1);
        //pixels[x + y *height] = hue(noise(y));
        var r = noise(x * pStep, y * pStep, z * pStep);

        var v = p5.Vector.fromAngle(2 * r * TWO_PI).mult(0.01);
        fill(r * 255);
        rect(x, y, grid, grid);

        push();
        stroke(0, 50);

        translate(x+grid /2, y + grid/2);
        rotate(v.heading());
        line(0, 0, grid/2, 0);

        strokeWeight(4);
        point(0, 0);
        pop();
      }
    }
  }

  strokeWeight(1);
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.pos;

    var r = noise(pos.x * pStep, pos.y * pStep, z * pStep);
    var v = p5.Vector.fromAngle(2 * 2 * r * TWO_PI).setMag(0.1);
    particle.applyForce(v);

    particle.update();
    particle.show();
  }

  z+= 10.0;

  fr.html(frameRate());
}
