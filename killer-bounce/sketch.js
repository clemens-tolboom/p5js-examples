// Game area
let gameSize = 40;
let spikes = [];

let scaleX = 13;
let scaleY = scaleX;

// Gravitiy
let g = 0.02

let player;

function setup() {
  createCanvas(400,400);

  spikes = new Spikes(gameSize);

  player = new Player(10);
}

function draw() {
  translate(width/2 - player.x, 0);
  background(128);

  fill(0,0,255);
  ellipse(50, 50, 80, 80);

  fill(255,255,0);

  spikes.draw();
  player.update();
  player.draw();

  spikes.hitTest(player);
}

class Player {
  constructor(y) {
    this.x = 0;
    this.y = y;
    this.vy = 1;
    this.ay = g;
  }

  update() {
    this.vy += this.ay;
    this.y += this.vy;

    if (this.y > height) {
      this.y = height/2;
      this.vy = 0;
    }
    this.processKeyboard();
  }

  draw() {
    fill(255,0,0);
    rect(this.x, this.y, scaleX, scaleY);
  }

  processKeyboard() {
    let y = 0;
  
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 1;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 1;
    }

    if (keyIsDown(UP_ARROW)) {
      this.vy -= g;
    }

    if (keyIsDown(DOWN_ARROW)) {
      this.vy += 5 * g;
    }
  }
}

class Spikes {
  constructor(amount) {
    this.amount = amount;
    this.spikes = []
    for(let i=0; i < amount; i++) {
      let h = Math.floor(Math.random() * height / scaleY);
      this.spikes.push(new Spike(i * scaleX, h, scaleX, scaleY));
    }
  }

  draw() {
    this.spikes.forEach(function(v) {
      v.draw();
    });
  }

  hitTest(player) {
    // Player either hits spot or on a edge right
    for(let sp=0; sp<2 ; sp++ ){
      let index = Math.floor(player.x / scaleX);
      let testIndex = index + sp;
      if (0<= testIndex && testIndex < this.spikes.length) {
        fill(255, 0, 255);
        rect( testIndex * scaleX, height - scaleY /4 - 2, scaleX, scaleY /4);
        if (this.spikes[testIndex].hitTest(player)) {
          player.vy = -2;
          this.spikes[testIndex].shrink();
          console.log('hit');
          break;
        }
      }
    }
  }
}

class Spike {
  constructor(x, height, sizeX, sizeY) {
    this.x = x;
    this.height = height
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  hitTest(player) {
    let y = player.y;
    if (this.height > 0){
      if (y > height - (this.height + 1) * scaleX) {
        rect(this.x - 1, y - 1, scaleX + 2, scaleY + 2);
        return true;
      }
    }
  }

  shrink() {
    this.height--;
  }

  update() {
    // FIXME
  }

  draw() {
    if (this.height !== 0) {
    let h = this.height * this.sizeY;
      rect(this.x, height - h - 1, this.sizeX, this.height * this.sizeY);
    }
  }
}
