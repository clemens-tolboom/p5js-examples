var rockets;
var mutatieRate;
var x;
var y;
var deltaX;
var deltaY;
var r;
var startPoint;
var target;
var UI;

function setup() {
  createCanvas(400, 400);

  startPoint = createVector(width / 2, height - 20);
  target = createVector(width / 2, 3);

  rockets = new Array(250);
  for (var i = 0; i < rockets.length; i++) {
    rockets[i] = new Rocket();
  }

  deltaX = 0.5;
  deltaY = deltaX;
  mutatieRate = 0.1;

  buildUI();
}

function buildUI() {
  UI = {};
  UI.restart = createButton('Restart');
  UI.restart.position(10, 10);
  UI.restart.mousePressed(restart);
  UI.slider = createSlider(0, 1, mutatieRate, 0.05);
  UI.slider.position(10, 30);
  UI.slider.style('width', '50px');
}

function restart() {
  // VIA : value, index, array
  rockets.forEach(function(v, i, a) {
    v.restart();
  });
  mutatieRate = UI.slider.value();
}

function draw() {
  fitness();

  background(255, 255, 255);
  fill(0, 0, 255);
  ellipse(startPoint.x, startPoint.y, 80, 8);

  if (rockets[0].isReady()) {
    generatePool();
  }

  for (var i = 0; i < rockets.length; i++) {
    rockets[i].update();
    rockets[i].draw();
  }

  fill(0, 255, 0);
  ellipse(target.x, target.y, 20, 8);
}

function fitness() {
  for (var i = 0; i < rockets.length; i++) {
    var rocket = rockets[i];
    var d = dist(rocket.pos.x, rocket.pos.y, target.x, target.y);
    var f = 1 / (d + 1);
    rocket.fitness = f;
    // console.log(f);
  }
}

function generatePool() {
  var survivors = rockets.sort(function(a, b) {
    return b.fitness - a.fitness;
  });
  var pool = survivors.slice(0, 100);
  var somFitness = 0;
  for (var i = 0; i < pool.length; i++) {
    somFitness += pool[i].fitness;
  }

  var genebank = new Array(0);
  for (var i = 0; i < pool.length; i++) {
    var rocket = pool[i];
    var aantal = rockets.length * rocket.fitness / somFitness;
    for (var j = 0; j < aantal; j++) {
      genebank.push(rocket.DNA);
    }
  }
  console.log(genebank.length);
  for (var i = 0; i < rockets.length; i++) {
    var DNA = crossing(random(genebank), random(genebank));
    mutate(DNA);
    var rocket = rockets[i];
    rocket.setDNA(DNA);
  }
}

function crossing(DNA1, DNA2) {
  var frag1 = DNA1.slice(0, DNA1.length / 2);
  var frag2 = DNA2.slice(DNA2.length / 2);
  return frag1.concat(frag2);
}

function mutate(DNA) {
  var dice = random(0, 1);
  if (dice <= mutatieRate) {
    var i = floor(random(DNA.length));
    var m = random([1, 2, 3, 4]);
    DNA[i] = m;
  }
}
