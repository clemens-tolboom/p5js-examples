/**
 * @file
 *
 * The play needs to escape the grid from the bottom.
 *
 * Score:
 * - hit a wall: -1 (top,left, right)
 * - hit bottom: +10
 *
 * Value function?!?
 */

// Actions for each cell of the grid.
var actions;

// Player
var player;

// TODO add policy class

function setup() {
  createCanvas(800, 800);

  restart();
}

function restart() {
  actions = new Actions(8,8);
  player = new Player();
}

function mousePressed() {
  restart();
}

function draw() {
  background(255);
  actions.draw();
  player.draw();
  player.move();

}

class Player {
  constructor() {
    this.cols = actions.cols;
    this.rows = actions.rows;

    // Current position
    this.col = this.cols / 2;
    this.row = 0;

    // Scale factor for drawing
    this.w = width / this.cols;
    this.h = height / this.rows;
  }

  draw() {
    fill(0,0,255);

    ellipse(this.col * this.w + this.w/2, this.row * this.h + this.h/2, 11, 11);
  }

  /**
   * Take a move for the current state.
   */
  move() {
    let r = this.row;
    let c = this.col;

    let move = actions.takeMove(r, c);

    // TODO: is this policy related code?!?
    // Execute move
    let score = this['move_' + move]();

    // apply score to new location
    actions.actions[this.row][this.col].value += score * 0.1;

    // adjust score for current location
    actions.updateAction(r,c,move, score);
  }

  // Policy
  move_up() {
    var score = 0;
    if (this.row == 0) {
      score = -1;
    }
    else {
      this.row-=1;
    }
    return score;
  }

  move_down() {
    var score = 0;
    if (this.row === this.rows -2) {
      score = 10;
      this.row = 0;
    }
    else {
      this.row+=1;
    }
    return score;
  }

  move_left() {
    var score = 0;
    if (this.col == 0) {
      score = -1;
    }
    else {
      this.col-=1;
    }
    return score;
  }

  move_right() {
    var score = 0;
    if (this.col == this.cols -1) {
      score = -1;
    }
    else {
      this.col+=1;
    }
    return score;
  }


}

class Action {
  constructor() {
    // Sum === 1.0
    this.up = 0.25;
    this.down = 0.25;
    this.left = 0.25;
    this.right = 0.25;
    this.value = 0;
  }

  draw(x,y) {
    stroke(255,0, 0);
    ellipse(x, y, (this.value+5) * 4, (this.value+5) * 4);

    stroke(0);

    line(x, y, x + this.right * 50, y)
    line(x, y, x - this.left * 50, y)

    line(x, y, x, y + this.down * 50)
    line(x, y, x, y - this.up * 50)
  }

  take() {
    var toss = random();
    if (toss < this.up) {
      return 'up';
    }

    if (toss < this.up + this.down) {
      return 'down';
    }

    if (toss < this.up + this.down + this.left) {
      return 'left';
    }
    return 'right';
  }

  update(move, score) {
    this[move]+= score * 0.01;
    this.value+= score * 0.1;
    this.normalize();
  }

  normalize() {
    let sum = this.up + this.down +  this.left +  this.right;
    this.up /= sum;
    this.down /= sum;
    this.left /= sum;
    this.right /= sum;
  }
}

class Actions {
  constructor(x,y) {
    this.rows = y;
    this.cols = x;
    var actions = new Array(y);
    for( var row= 0; row< this.rows; row++) {
      actions[row] = new Array(x);
      for( var col= 0; col< this.cols; col++) {
        actions[row][col] = new Action();
      }
    }
    this.actions = actions;
  }

  takeMove(row, col) {
    return this.actions[row][col].take();
  }

  updateAction(row,col,move, score) {
    this.actions[row][col].update(move, score);
  }

  draw() {
    noFill();
    let w = width/this.cols;
    let h = height/this.rows;
    for( var row= 0; row< this.rows; row++) {
      for( var col= 0; col< this.cols; col++) {
        let x = col*w + w/2;
        let y = row*h + h/2
        stroke(0, 0, 0);
        rect(x - w/2, y - h/2, w-1, h-1);
        let a = this.actions[row][col];
        a.draw(x,y);
      }
    }
  }
}
