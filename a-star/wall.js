class Walls {
    constructor() {
        //
    }

    draw() {
        fill(128, 128, 128);

        rect(0, 0, size, height);
        rect(0, 0, width, size);
        rect(width, 0, -size, height);
        rect(0, height, width, -size);
    }

    hitTest(head) {
        if (size * (1 + head.x) < size || size * (1 + head.x) > width - 2 * size) {
            return true;
        }
        if (size * (1 + head.y) < size || size * (1 + head.y) > height - 2 * size) {
            return true;
        }
    }
}
