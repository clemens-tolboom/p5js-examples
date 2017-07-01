var pos;
var snakes;

function setup() {
  createCanvas(windowWidth, windowHeight);

  snake = new Snake();
  snakes = new Snakes(20);

  init();
}

function draw() {
  
  translate( width/2, height/2);
  background(240);

  strokeWeight(4);
  stroke(255, 0, 0);

  point(pos.x, pos.y);
  
  snakes.update();
  snakes.draw();
  
  //noLoop();
}

function mousePressed() {
  if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    //toggleFullscreen();
  }
}

function init() {
  pos = createVector(width* random(-0.5, 0.5), height * random(-0.5, 0.5));
  pos.x = pos.x;
  pos.y = pos.y;
  
  snake.init();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  debug( "" + width + "x" + height);
  init();
}

function toggleFullscreen() {
  var fs = fullscreen();
  if (fs) {
    fullscreen(false);
    resizeCanvas(windowWidth, windowHeight);
  } else {
    fullscreen(true);
    resizeCanvas(displayWidth, displayHeight);
  }
}

function debug(s) {
  console.debug(s);
}