let position;
let velocity;

let metronome;
let fps = 25;

let bpm = 120;

// Midi notes
let notes = [60, 70, 80, 90, 100];
// Choose from notes 0, 1, 2, ...
let pattern = '0.1.2.3.4...';
let note;
let speed;

function setup() {
  createCanvas(800, 800);

  speed = width / fps;

  position = createVector(width / 2, height / 2);
  velocity = createVector(speed, 0);
//  console.log(frameRate(80));
  metronome = new Metronome(pattern);
  metronome.play();
}

function draw() {
  background(0);
  circle(position.x, position.y, 10)
  position.add(velocity);
  if (0 <= position.x && position.x < width) {
    // Valid beat
    if (position.x < 25) {
      metronome.play(0);
    } else if (width - 25 < position.x) {
      metronome.play(1);
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

let i = 0;

class Metronome {
  constructor(pattern) {
    this.pattern = pattern;
    this.current = 0;
    this.oscilator = new p5.Oscillator('Sinus');
    this.running = false;
  }

  next() {
    if (this.current + 1 < this.pattern.length) {
      this.current++;
    }
    else {
      this.current = 0;
    }
  }

  getNote() {
    return this.pattern[this.current];
  }

  play() {
    if (this.running) {
      return;
    }
    this.running = true;

    let note = this.getNote();
    console.log(frameCount, note);
    if (note === '.') {

    }
    else {
      let freq = midiToFreq(notes[note]);
      this.oscilator.freq(freq);
      this.oscilator.start();
    }
    this.next();
  }

  stop() {
    this.running = false;
    this.oscilator.stop();
  }
}