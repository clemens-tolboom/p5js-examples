let snake;
let food;
let walls;

// cells are 20 x 20 pixels
let size = 20;
// grid is 40 x 40 cells
let spacing = 40;
let pathfinder;

function setup() {
  let c = createCanvas(size * (spacing + 2), size * (spacing + 2));
  c.parent("sketch-holder");

  snake = new Snake(10, 10);
  food = new Food(20, 20);
  walls = new Walls();

  pathfinder = new PathFinder();
  frameRate(5);
}

function draw() {
  background(255);

  if (snake.dead == 0) {
    pathfinder.find(snake, food);
    pathfinder.draw();
  }
  walls.draw();
  food.draw();
  snake.draw();

  snake.update();
}

function keyPressed() {
  console.log("keyCode", keyCode);
  if (keyCode === LEFT_ARROW) {
    snake.left();
  } else if (keyCode === RIGHT_ARROW) {
    snake.right();
  }
}

