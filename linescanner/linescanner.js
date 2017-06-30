var drawing;
var x, y;
var scanLine;
var scanIndex;
var prevLine;
var blobs;

function setup() {
  createCanvas(200, 200);

  x = 0;
  y = 0;
  scanLine = [];
  scanIndex = -1;

  blobs = [];
}

function draw() {
  background(255);
  if (frameCount == 1) {
    drawScene();

    loadPixels();
    drawing = get();
    console.log('grabbed frame');
  } else {

    image(drawing, 0, 0);

    //updatePixels();

    loadPixels();

    // Do loop# of pixels on each frame.
    var loop = width;
    while (loop > 0) {
      loop--;

      // Invalid blob index
      scanLine[x] = -1;

      // Matching color found
      if (get(x, y)[0] == 0) {

        if ( x == 0 && y == 0) {
          scanLine[x] = addBlob(x, y);
        } else {
          var index = findIndex(x, y);
          if (index == -1) {
            scanLine[x] = addBlob(x, y);
            console.log('new blob', scanLine[x]);
          } else {
            scanLine[x] = index;
          }
        }
        var blob = blobs[scanLine[x]];
        blob.addPixel(x, y);
      }

      fill(127);
      stroke(255, 0, 0, 50);
      point(x, y);
      x++;
      if (x == width) {
        x = 0;
        prevLine = scanLine;
        scanLine = [];
        y++;
        if (y == height) {
          y = 0;


          drawBlobs();
          // DONE
          noLoop();
        }
      }
    }
  }

  // drawBlobs();
}

function drawBlobs() {
  blobs.forEach(function(blob) {
    blob.draw();
  }
  );
}

/*
 * Creates new blob.
 *
 * @return index of new blob
 */
function addBlob(x, y) {
  var blob = new Blob(x, y);
  blobs.push(blob);
  return blobs.length - 1;
}

function findIndex(x, y) {
  var index = -1;
  if (x > 0) {
    index = scanLine[x-1];
  }
  if (y > 0) {
    var minX = max(0, x - 3);
    var maxX = min(width, x + 3);
    for (var i= minX; i <= maxX; i++) {
      index = max(index, prevLine[i]);
    }
  }
  return index;
}

function drawScene() {
  stroke(0);
  fill(0);
  ellipse(100, 11, 20, 20);

  ellipse(150, 12, 20, 20);
  ellipse(175, 12, 21, 21);

  ellipse(10, 10, 10, 10);
  ellipse(50, 20, 30, 30);

  ellipse(90, 90, 40, 40);
  ellipse(150, 120, 40, 40);
  ellipse(50, 170, 40, 40);
}  
