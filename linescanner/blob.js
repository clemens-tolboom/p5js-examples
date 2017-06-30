function Blob(x, y) {
  this.minX = x;
  this.maxX = x;

  this.minY = y;
  this.maxY = y;

  // For debugging purpose
  this.pixels = [[x, y]];

  this.addPixel = function (x, y) {
    this.minX = min(this.minX, x);
    this.maxX = max(this.maxX, x);

    this.minY = min(this.minY, y);
    this.maxY = max(this.maxY, y);
    
    this.pixels.push([x, y]);
  }

  this.draw = function() {
    stroke(0, 0, 255);
    fill(0,0,255);
    rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
    this.pixels.forEach(function(v) {
      stroke(0, 255, 0);
      point(v[0], v[1]);
    }
    );
  }
}
