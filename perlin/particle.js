function Particle(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);  
  this.acc = createVector(0, 0);

  this.color = 0;
  this.opacity = 0;
  this.previousPos = this.pos.copy();

  this.maximumSpeed = 2.0;

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maximumSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.edge();

  }

  this.applyForce = function(force) {
    this.acc.add(force.mult(2));
  }

  this.show = function() {
    var color = this.nextColor(80.0, 120.0);
    colorMode(HSB);
    //stroke(this.color, 100, 100, this.opacity);
    stroke(color, 100, 100, 100);
    strokeWeight(20);
    point( this.pos.x, this.pos.y);
    line(this.previousPos.x, this.previousPos.y, this.pos.x, this.pos.y);
    this.setPrevious();
    colorMode(RGB);
    if (this.opacity < 0.5) {
      this.opacity+= 0.0001;
    }
  }

  this.setPrevious = function() {
    this.previousPos = this.pos.copy();
  }

  this.edge = function() {
    var touched = false;

    if (this.pos.x >= width) {
      this.pos.x = 0;
      touched = true;
    }
    if (this.pos.x < 0) {
      touched = true;
      this.pos.x = width - 1;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      touched = true;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      touched = true;
    }

    if (touched) {
      this.setPrevious();
    }
  }
  
  this.nextColor = function(range, shift) {
    if (!this.colorDirection) {
      this.colorDirection = 1;
    }
    var color = this.color+ 0.1 * this.colorDirection;
   
    if (color < 0) {
      this.colorDirection = 1.0;
      color = 0.0;
    }
    if (color > range) {
      this.colorDirection = -1.0;
      color = range;
    }
    this.color = color;
    return color + shift;
  }    
}
