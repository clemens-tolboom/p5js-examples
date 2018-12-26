let p;

let grid;
let length;
let agenda;
let size = 20;
let index = 0;

function setup() {
    createCanvas(windowWidth, windowWidth);
    p = createVector(0, 0);
    length = width / (3 * size + 1);
    dir = createVector(0, length, 0);

    grid = [];

    agenda = [];
    addItem(0, 0, true);

    background(200);
    //    frameRate(1);
    colorMode(HSB, 360, 100, 100, 1);

}

function draw() {
    translate(width / 2, height / 2);

    if (agenda.length) {
        let item = agenda.shift();

        if (gridIsValid(item, true)) {
            stroke(index++, 100, 100);
            index = index % 360;
        
            let v = getGridValue(item.x, item.y);
            setGridValue(item.x, item.y, v + 1);
            p.x = item.x;
            p.y = item.y;
            p.mult(length);

            strokeWeight(2);
            if (item.h) {
                // horizontal
                line(p.x - length * 0.9, p.y, p.x + length * 0.9, p.y);
            } else {
                // vertical
                line(p.x, p.y - length * 0.9, p.x, p.y + length * 0.9);
            }
            if (item.h) {
                // vertical
                addItem(item.x, item.y - 1, false);
                addItem(item.x, item.y + 1, false);
            } else {
                // horizontal
                addItem(item.x - 1, item.y, true);
                addItem(item.x + 1, item.y, true);
            }
        }
    }
}

function addItem(x, y, h) {
    if (Math.abs(x) >= size) return;
    if (Math.abs(y) >= size) return;

    let v = getGridValue(x, y);
    console.log("Testing", x, y, h, '=>', v);
    if (v < 1) {
        agenda.push({ x: x, y: y, h: h });
        console.log("Pushed", x, y, h);
    }
}

function getGridValue(x, y) {
    if (x < 0) {
        x = size - x;
    }
    if (y < 0) {
        y = size - y;
    }
    if (!grid[x]) {
        grid[x] = [];
    }
    if (!grid[x][y]) {
        grid[x][y] = 0;
    }

    let v = grid[x][y];
    return v;
}

function setGridValue(x, y, v) {
    if (x < 0) {
        x = size - x;
    }
    if (y < 0) {
        y = size - y;
    }

    grid[x][y] = v;
}

function gridIsValid(item, initial) {
    initial = initial || false;
    // Can we (potentially) draw a toothpick
    let x = item.x;
    let y = item.y;
    let h = item.h;

    let center = getGridValue(x, y);
    if (center == 1 || (center == 0 && initial)) {
        let pMin, pMax;
        if (h) {
            // Horizontal
            pMin = getGridValue(x - 1, y);
            pMax = getGridValue(x + 1, y);
        }
        else {
            // Horizontal
            pMin = getGridValue(x, y - 1);
            pMax = getGridValue(x, y + 1);
        }
        if (pMin < 2 && pMax < 2) {
            return true;
        }
    }
    return false;
}