let position;
let velocity;

let metronome;
let fps = 60
let bpm = 120;

// Midi notes
let notes = [0, 70, 64, 58, 52];
// Choose from notes 0, 1, 2, ...
let pattern = '13323';
let note;

let form;
let patterns;
let nominator;
let denominator;

/**
 * Speed is a bad solution but quick for now.
 *
 * Pass the width in bpm/60 seconds per frame step.
 */
function speed() {
  return width * bpm / 60 / fps;
}

function setup() {
  // create Canvas first as we need it's width for speed
  createCanvas(400, 400);

  position = createVector(width / 2, height / 2);
  velocity = createVector(speed(), 0);

  patterns = new Patterns();

  nominator = 4;
  denominator = 4;

  form = new Form(patterns, function (event, value) {
    console.log(event, value);
    if (event == "form.bpm") {
      bpm = value;
      velocity.x = speed();
    }
    else if (event == "form.stop") {
      velocity.x = 0;
    }
  });

  metronome = new Metronome(pattern, bpm);
  form.setPattern(pattern);
  metronome.play();

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
  form.showActive();
}
