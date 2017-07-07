/**
 * Our rocket has DNA as string of fire instructions.
 *
 * Each draw we read the next DNA[allelIndex];
 */
function Rocket() {
  this.DNA = new Array(200);
  this.restart();
}

/**
 * Start over with current DNA
 */
Rocket.prototype.init = function() {
  this.pos = createVector(startPoint.x, startPoint.y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.allelIndex = 0;
}

/**
 * Restart with new DNA.
 */
Rocket.prototype.restart = function() {
  for (var i = 0; i < this.DNA.length; i++) {
    this.DNA[i] = floor(random([1, 2, 3, 4]));
  }
  this.init();
}

Rocket.prototype.draw = function() {
  var k = 1 / this.fitness;
  noStroke();
  fill(255 - k, 0, 0);
  rect(this.pos.x, this.pos.y, 8, 14);
}

/**
 * We can disturb the rocket with arrow keys.
 */
Rocket.prototype.update = function() {
  this.readAllel();
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
  this.allelIndex++;

  if (keyIsDown(LEFT_ARROW)) {
    this.applyForce(createVector(-0.1, 0));
  } else if (keyIsDown(RIGHT_ARROW)) {
    this.applyForce(createVector(0.1, 0));
  }
  if (keyIsDown(UP_ARROW)) {
    this.applyForce(createVector(0, -0.1));
  } else if (keyIsDown(DOWN_ARROW)) {
    this.applyForce(createVector(0, 0.1));
  }
}

Rocket.prototype.readAllel = function() {
  if (this.allelIndex >= this.DNA.length) {
    this.vel.mult(0);
    return;
  }
  var m = this.DNA[this.allelIndex];
  if (m == 1) {
    this.applyForce(createVector(-0.1, 0));
  }
  if (m == 2) {
    this.applyForce(createVector(0.1, 0));
  }
  if (m == 3) {
    this.applyForce(createVector(0, 0.1));
  }
  if (m == 4) {
    this.applyForce(createVector(0, -0.1));
  }
}


Rocket.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Rocket.prototype.setDNA = function(DNA) {
  this.init();
  this.DNA = DNA;
}

Rocket.prototype.isReady = function() {
  return this.allelIndex >= this.DNA.length;
}
