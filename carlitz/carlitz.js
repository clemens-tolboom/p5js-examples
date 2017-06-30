var start;
var stop;

function setup() {
  createCanvas(400, 400);

  start = 2;
  stop = 400;
}

function draw() {
  background(123);

  colorMode(HSB);

  for (var i = start; i < stop; i++) {
    var color = (i * 120) % 360;

    stroke(color, 100, 100);
    var count = 0;
    var x = i;
    while (x>=2) {
      x = carlitz(x);
      count++;
    }

    line(i, height, i, height - 10 * count);
  }

  //noLoop();
  if (mouseIsPressed) {
    if (mouseButton == LEFT)
      ellipse(50, 50, 50, 50);
    if (mouseButton == RIGHT)
      rect(25, 25, 50, 50);
    if (mouseButton == CENTER)
      triangle(23, 75, 50, 20, 78, 75);
  }

  print(mouseButton);
}

function carlitz(x) {
  if ( x % 2) {
    // even
    return x / 2;
  } else {
    // odd
    return 3 * x + 1;
  }
}
