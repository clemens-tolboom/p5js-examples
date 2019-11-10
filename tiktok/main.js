let position;
let velocity;

let metronome;
let fps = 5;

let bpm = 120;

// Midi notes
let notes = [0, 70, 64, 58, 52];
// Choose from notes 0, 1, 2, ...
let pattern = '13323';
let note;
let speed;

let form;
let patterns;
let nominator;
let denominator;

function setup() {
  speed = width / fps;

  position = createVector(width / 2, height / 2);
  velocity = createVector(speed, 0);

  patterns = new Patterns();

  nominator = 4;
  denominator = 4;

  form = new Form(patterns);

//  noLoop();
  metronome = new Metronome(pattern, 120);
  metronome.play();

  createCanvas(400, 400);
}

function draw() {
  background(0);
  circle(position.x, position.y, 10)
  position.add(velocity);
  if (0 <= position.x && position.x < width) {
    // Valid beat
    if (position.x < 25) {
      metronome.play();
    } else if (width - 25 < position.x) {
      metronome.play();
    }
    else {
      //console.log('-');
      metronome.stop();
    }
  }
  else {
    velocity.x = -velocity.x;
  }
  if (0 <= position.y && position.y < height) {
    // OK
  }
  else {
    velocity.y = -velocity.y;
  }
}
