function Snake() {
  this.color = floor(random(360));
  this.speed = random(5, 10);
  this.tail = new Array(20);

  this.init();
}

Snake.prototype.init = function () {
  var speed = this.speed;

  this.pos = createVector(width* random(-0.5, 0.5), height * random(-0.5, 0.5));
  for (var i=0; i< this.tail.length; i++) {
    this.tail[i] = createVector(this.pos.x, this.pos.y);
  }

  this.vel = createVector(random(-speed, speed), random(-speed, speed));
  this.acc = createVector(0, 0);
}

Snake.prototype.applyForce = function (force) {
  this.acc.add(force);
}

Snake.prototype.draw = function () {
  colorMode(HSB);

  strokeWeight(20);

  for (var i=0; i< this.tail.length; i++) {
    stroke(this.color, 100, 100, 50 - 5 * i);
    point(this.tail[i].x, this.tail[i].y);
  }

  point(this.pos.x, this.pos.y);
}

Snake.prototype.update = function (others) {

  for (var i= this.tail.length -1; i > 0; i--) {
    this.tail[i].x = this.tail[i - 1].x;
    this.tail[i].y = this.tail[i - 1].y;
  }
  this.tail[i].x = this.pos.x;
  this.tail[i].y = this.pos.y;

  if (dist(this.pos.x, this.pos.y, mouseX - width/2, mouseY - height/2) < 100) {
    var force = createVector(this.pos.x - (mouseX - width/2), this.pos.y - (mouseY - height/2)); 
    force.normalize().mult(5);
    this.applyForce(force);
  }

  var me = this;
  others.forEach(function(v, i, a) {
    if (v !== me) {
      //p5.Vector.
    }
  }
  );
  this.pos.add(this.vel);
  this.vel.add(this.acc).mult(0.99);
  this.acc.mult(0);


  // Wrap around
  var wrapped = false;
  if (-width/2 > this.pos.x || this.pos.x > width /2) {
    this.vel.x = - this.vel.x;
    wrapped = true;
  }

  if (- height/2 > this.pos.y || this.pos.y > height / 2) {
    this.vel.y = - this.vel.y;
    wrapped = true;
  }

  if (wrapped) {
    console.log(this);
  }
  if ( this.vel.mag() < 0.01 && wrapped) {
    this.pos.mult(0.99);
  }
}
