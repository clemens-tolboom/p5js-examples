function Snakes(n) {
  this.snakes = new Array(n);

  for (var i = 0; i< this.snakes.length; i++) {
    this.snakes[i] = new Snake( 10);
  };
}

Snakes.prototype.update = function() {
  this.snakes.forEach(function(v, i, a) {
    v.update(a);
  }
  );
}

Snakes.prototype.draw = function() {
  this.snakes.forEach(function(v, i, a) {
    v.draw();
  }
  );
}
