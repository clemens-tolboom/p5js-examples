// https://en.wikipedia.org/wiki/Fibonacci_number

var logP;
var result;
var stopLevel;

function setup() {
  noCanvas();

  logP = createP('Logging: ');
  result = new Array();
  result[0] = 1;
  
  stopLevel = 0.3;
  
  console.log("Stopping at " + stopLevel);
}

function draw() {
  var text = logP.html();
  var regel = 'fib(' + (result.length - 1) + ') = ' + result[result.length-1]+ "\t"+ 'frameRate: ' + (floor(100*frameRate())/ 100);
  text += '<br/>' + regel;
  console.log(regel);
  logP.html(text);

  result[result.length] = fib(result.length);

  if (frameRate()< stopLevel && result.length > 2 || result.length > 500) {
    noLoop();
  }
}

function fib(x) {
  var result;
  
  if (x > 1) {
    return fib( x - 1) + fib(x-2);
  }
  return 1;
}


















var fibs = new Array();

function better_fib(x) {
  var result;
  
  if (x > 1) {
    result = fibs[x] || better_fib( x - 1) + better_fib(x-2);
    fibs[x] = result;
    return fibs[x];
  }
  return 1;
}
