var nucleons;

function setup() {
  createCanvas(800, 800);

  nucleons = new Array(10);

  restart();
}

function restart() {
  let radius = 10;
  let strongRadius = 14;
  for(var i = 0; i< nucleons.length; i++) {
    let n = new Nucleon(radius);
    n.p.x = width/2 + strongRadius * Math.cos(TWO_PI * i / nucleons.length);
    n.p.y = height/2 + strongRadius * Math.sin(TWO_PI * i / nucleons.length);
    nucleons[i] = n;

  }

}

function mousePressed() {
  restart();
}

function draw() {
//  background(255,0,255);

  // Reset all forces
  for( var n of nucleons) {
    n.zeroForce();
  }

  // Interaction forces
  for (var i = 0; i < nucleons.length; i++) {
    let n = nucleons[i];
    for (var j = i + 1; j< nucleons.length; j++) {
      //console.log(i + ", " + j);
      let m = nucleons[j];

      //m.addElectricForce(n);
      //m.addStrongForce(n);

      n.addElectricForce(m);
      n.addStrongForce(m);
    }
    n.addResistance();
  }

  for( var n of nucleons) {
    n.update();
    n.draw();
  }
}


// https://en.wikipedia.org/wiki/Atom
class Nucleon {
  constructor(r) {
    this.r = r;

    // Position
    this.p = createVector(width/2 + random(-5,5), height/2+ random(-5,5));

    // Velocity
    this.v = createVector(0, 0);
    //this.v = p5.Vector.random2D();

    // Acceleration
    this.a = createVector(0,0);

    // Force
    this.f = createVector(0,0);
  }

  zeroForce() {
    this.f.mult(0);
  }

  addForce(f) {
    this.f.add(f);
  }

  addElectricForce(n) {
    var dir = p5.Vector.sub(this.p, n.p);
    var dist2 = dir.magSq()

    let repulse = 5.0;
    if (dist2 > 0.01) {
      //console.log("Electric");
      this.addForce(dir.mult(repulse/ dist2));
      n.addForce(dir.mult(-repulse/ dist2));
    }
  }

  addStrongForce(n) {
    var dir = p5.Vector.sub(this.p, n.p);
    var dist2 = dir.magSq()

    var rs = 2*(this.r + n.r);

    if (rs * 0.9 < dist2 && dist2 < rs * 1.1) {
      //console.log('Strong force attracting.');
      this.addForce(dir.mult(-1));
      n.addForce(dir.mult(-1));
    } else if (dist2 <= rs * 0.9) {
      //console.log('Strong force repelling.')
      this.addForce(dir.mult(1));
      n.addForce(dir.mult(-1));
    }

  }

  addResistance() {
    this.v.mult(0.9);
  }

  draw () {
    stroke(0);
    ellipse(this.p.x, this.p.y, this.r, this.r);
    stroke(0, 255,0);
    line(this.p.x, this.p.y, this.p.x + this.v.x, this.p.y + this.v.y)
    stroke(0, 0, 255);
    line(this.p.x, this.p.y, this.p.x + this.a.x, this.p.y + this.a.y)
  }

  update() {
    if (this.p.x < 0) {
      this.p.x = this.p.x + width;
    }
    else if (this.p.x > width) {
      this.p.x = this.p.x - width;
    }

    if (this.p.y < 0) {
      this.p.y = this.p.y + height;
    }
    else if (this.p.y > height) {
      this.p.y = this.p.y - height;
    }

    this.a.add(this.f);
    this.v.add(this.a);
    this.p.add(this.v);

    // Force processed so stunn A
    this.a.mult(0);

  }
}
