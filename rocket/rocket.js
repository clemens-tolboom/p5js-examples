/**
 * Our rocket has DNA as a string of fire instructions.
 *
 * DNA has genen encoding instructions. We assume 4 engines: left, right, up
 * and down. A gene encode one engine is fired. Each step we read the
 * next DNA[geneIndex].
 *
 * @TODO: why not encode for NO engine firing?
 * @TODO: could we let rockets land instead of being nearby the target?
 */
function Rocket() {
  this.DNA = new Array(height/2);
  this.restart();
}

/**
 * Start over with current DNA
 */
Rocket.prototype.init = function() {
  this.pos = createVector(startPoint.x, startPoint.y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.geneIndex = 0;
  this.engine = 0;
}

/**
 * Start over with new DNA.
 *
 */
Rocket.prototype.restart = function() {
  for (var i = 0; i < this.DNA.length; i++) {
    // @TODO: add a no engine fired aka 0?
    this.DNA[i] = floor(random([1, 2, 3, 4]));
  }
  this.init();
}

/**
 * We draw the rocket with its engine firing.
 */
Rocket.prototype.draw = function() {
  rectMode(RADIUS);

  var k = 1 / this.fitness;
  noStroke();
  fill(255 - k, 0, 0);
  rect(this.pos.x, this.pos.y, 6, 14);

  // Draw engine firing if any
  var x = this.pos.x;
  var y = this.pos.y;

  if (this.engine == 1) {
    x += 8;
  }
  else if (this.engine == 2) {
    x -= 8;
  }
  else if (this.engine == 3) {
    y += 14;
  }
  else if (this.engine == 4) {
    y -= 14;
  }
  fill(0, 0, 255, 90);
  rect(x, y, 3, 3);
}

/**
 * Each update we read the next gene and apply forces.
 *
 * We can also disturb the rocket with arrow keys.
 */
Rocket.prototype.update = function() {
  this.readGene();
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
  this.geneIndex++;

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

/**
 * We need to know what engine to fire.
 */
Rocket.prototype.readGene = function() {
  if (this.geneIndex >= this.DNA.length) {
    this.vel.mult(0);
    return;
  }
  var m = this.DNA[this.geneIndex];
  this.engine = m;
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

/**
 * Forces are added to the current accelleration.
 *
 * @TODO: add a mass to a rocket?
 */
Rocket.prototype.applyForce = function(f) {
  this.acc.add(f);
}

/**
 * setDNA is called when generating the next generation.
 */
Rocket.prototype.setDNA = function(DNA) {
  this.init();
  this.DNA = DNA;
}

/**
 * When all genes are read we are ready.
 */
Rocket.prototype.isReady = function() {
  return this.geneIndex >= this.DNA.length;
}
