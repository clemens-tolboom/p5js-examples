class Food {
    constructor(x, y) {
      this.position = createVector(x, y);
    }
  
    draw() {
      fill(128, 128, 0);
      rect(size * (1 + this.position.x), size * (1 + this.position.y), size, size);
    }
  
    hit(p) {
      let hit = (p.x == this.position.x) && (p.y === this.position.y);
  
      return hit;
    }
  
    spawn() {
      this.position.x = Math.floor(random(1, 40));
      this.position.y = Math.floor(random(1, 40));
    }
  }
  