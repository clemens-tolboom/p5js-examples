/**
 * https://www.youtube.com/watch?v=1o4naC4P8-M
 *
 * https://github.com/Code-Bullet/AsteroidsAI
 *
 * http://keycode.info/
 */

/**
 * @var Asteroids asteroids
 */

let asteroids;

class Game {
    constructor() {
        this.asteroids = null;
        this.restartTicks = -1;

        this.rangeZeroOne = new nRange(0, 1, [0, 1]);
        this.keyDelay = []
    }

    setup() {
        angleMode(DEGREES);

        createCanvas(1024, 768);

        this.restart();

        this.nInput = this.vectorizeInput();
        this.nOutput = this.vectorizeOutput();

        this.neuralNet = new nNet(this.nInput, this.nOutput, [4, 8]);

        this.neuralNet.forward();
    }

    responseKeys() {
        return ['canFire', 'score', 'rocks'
            , 'radar-0', 'radar-1', 'radar-2', 'radar-3'
            , 'radar-4', 'radar-5', 'radar-6', 'radar-7'
        ];
    }

    actionKeys() {
        return ['up', 'down', 'left', 'right', 'fire', 'space'];
    }

    mapResponse() {
        let keys = this.responseKeys();
        let val;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (key.indexOf('-') !== -1) {
                let spl = key.split('-');
                let k = spl[0];
                let ind = int(spl[1]);
                val = this.asteroids.outputs[k][ind];
            }
            else {
                val = this.asteroids.outputs[key];
            }

            this.nInput[i] = val;
        }
    }

    setAIActions() {
        let inputs = this.asteroids.inputs;
        let keys = this.actionKeys();
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let val = this.nOutput[i];
            inputs[key] = this.rangeZeroOne.fromValue(val);
        }
    }

    vectorizeInput() {
        let keys = this.responseKeys();

        let result = new Array(keys.length);
        result.fill(0);
        return result;
    }

    vectorizeOutput() {
        let keys = this.actionKeys();
        let result = new Array(keys.length);
        result.fill(random());
        return result;
    }

    restart() {
        this.asteroids = new Asteroids(createVector(width / 2, 50));

        this.asteroids.isAI = this.isAI;
    }


    setAI(ai) {
        this.isAI = ai;
        this.asteroids.isAI = this.isAI;
    }

    getAI() {
        return this.asteroids.isAI;
    }

    draw() {
        if (keyIsDown(65)) {
            if ((this.keyDelay[65] || 0) <= 0) {
                this.setAI(!this.getAI());
                this.keyDelay[65] = 50;
                console.log('AI: ' + this.getAI() + " A: " + this.keyDelay[65]);
            }
        }
        this.keyDelay[65]--;
        background(0);

        if (this.isAI) {
            this.mapResponse();
            this.neuralNet.forward();
            this.setAIActions();
        }

        this.asteroids.run();
        if (this.asteroids.outputs.dead || this.asteroids.outputs.won) {
            if (this.restartTicks == -1) {
                this.restartTicks = 5;
            }
            else if (this.restartTicks > 0) {
                this.restartTicks--;
            }
            else {
                this.restartTicks = -1;
                this.restart();

            }
        }
    }
}

let game = new Game();

function setup() {
    game.setup();
}

function draw() {
    game.draw();
}
