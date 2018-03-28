let tree;

function setup() {
  createCanvas(width,height);
  createCanvas(windowWidth, windowHeight);

  var center = new Point(width/2, height/2);
  var dims = new Point(width/2, height/2);

  tree = new nTree(4, center, dims);

  let nPoints = 10000;
  for(var i = 0; i< nPoints; i++) {
    tree.insertPoint(new Point(random(width), random(height)));
  }

}

function mousePressed() {
  tree.insertPoint(new Point(mouseX, mouseY));
}

function draw() {
  background(0);

  stroke(255);

  points = 0;
  rects = 0;

  tree.visit(function(center, dims){
    stroke(255,0,0);
    fill(0,0,0,0);
    strokeWeight(1);
    
    rectMode(RADIUS);
    rect(center.x, center.y, dims.x, dims.y);
  }, function(p){
    stroke(255);
    strokeWeight(2);
    point(p.x, p.y);
  });
}

class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class nTree {
  constructor(capacity, center, dims) {
    // a two (2) dimensional space
    this.dimensions = 2;

    this.capacity = capacity;

    this.points = [];
    this.subtree = [];

    this.center = center;
    this.dims = dims;
  }

  isValid(p) {
    return this.center.x - this.dims.x <= p.x && p.x < this.center.x + this.dims.x
      && this.center.y - this.dims.y <= p.y && p.y < this.center.y + this.dims.y
    ;
  }

  insertPoint(p) {
    if (this.isValid(p)) {
      if (this.subtree.length === 0 && this.capacity > this.points.length) {
        this.points.push(p);
      }
      else {
        // split up tree into subtree
        if (this.subtree.length === 0) {
          let x = this.center.x;
          let y = this.center.y;
          let w = this.dims.x;
          let h = this.dims.y;
          var subTree;
          //for(var i=0; i< this.dimensions * this.dimensions; i++) {
            // TODO: add odometer for higher dimensions
            subTree = new nTree(this.capacity, new Point(x-w/2, y-h/2), new Point(w/2, h/2));
            this.subtree.push(subTree);
            subTree = new nTree(this.capacity, new Point(x+w/2, y-h/2), new Point(w/2, h/2));
            this.subtree.push(subTree);
            subTree = new nTree(this.capacity, new Point(x-w/2, y+h/2), new Point(w/2, h/2));
            this.subtree.push(subTree);
            subTree = new nTree(this.capacity, new Point(x+w/2, y+h/2), new Point(w/2, h/2));
            this.subtree.push(subTree);
          //}

          // Reinject points
          for(var oldP of this.points) {
            this.insertPoint(oldP);
          }
          this.points = [];
        }
        var inserted = false;
        for (var subTree of this.subtree) {
          if (subTree.insertPoint(p)) {
            inserted = true;
            break;
          }
        }
      }
    }

    return false;
  }

  /**
   * Allow for visitor pattern.
   *
   * @param {function} callbackContainer (center, dims)
   * @param {function} callbackPoint ( point )
   */
  visit(callbackContainer, callbackPoint) {
    callbackContainer(this.center, this.dims);
    if (this.subtree.length !==0) {
      for(var subTree of this.subtree) {
        subTree.visit(callbackContainer, callbackPoint);
      }
    }
    else {
      for(var p of this.points) {
        callbackPoint(p);
      }
    }
  }
}