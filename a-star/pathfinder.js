class PathFinder {
    constructor() {
        this.grid = [];
        this.reset();
    }

    reset() {
        let g = this.grid;
        for (let i = 0; i < spacing; i++) {
            g[i] = [];
            for (let j = 0; j < spacing; j++) {
                g[i][j] = 1024;
            }
        }
    }

    find(snake, food) {
        this.reset();
        let head = snake.segments[0];
        let g = this.grid;
        snake.segments.forEach(p => {
            g[p.x][p.y] = -1;
        });
        // Start point value is zero
        let currentScore = 0;
        g[head.x][head.y] = currentScore;
        let agenda = [head];
        let maxSteps = 4 * spacing * spacing;
        while (agenda.length > 0 && 0 < maxSteps) {
            maxSteps--;
            let current = agenda.shift();
            let x = current.x;
            let y = current.y;
            currentScore = g[x][y];
            if (0 <= x && x < spacing && 0 <= y && y < spacing) {
                let testPoints = [
                    { x: x - 1, y: y },
                    { x: x + 1, y: y },
                    { x: x, y: y - 1 },
                    { x: x, y: y + 1 }
                ];
                testPoints.forEach(t => {
                    let xx = t.x;
                    let yy = t.y;
                    if (0 <= xx && xx < spacing && 0 <= yy && yy < spacing) {
                        let score = g[xx][yy];
                        if (currentScore + 1 < score) {
                            g[xx][yy] = currentScore + 1;
                            agenda.push(t);
                        }
                    }
                });
            }
        }
    }

    draw() {
        strokeWeight(4);
        let g = this.grid;
        for (let i = 0; i < spacing; i++) {
            for (let j = 0; j < spacing; j++) {
                let state = g[i][j];
                stroke(255);
                if (state == -1) {
                    stroke(255, 255, 255);
                }
                else if (state < 25) {
                    stroke(255 - state * 10, 0, 0);
                }
                point((1.5 + i) * size, (1.5 + j) * size);
            }
        }
        strokeWeight(1);
    }
}
