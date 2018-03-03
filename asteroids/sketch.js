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
let net;

class Game {

    constructor() {
        this.asteroids = null;
        this.restartTicks = -1;

        this.rangeZeroOne = new nRange(0, 1, [0, 1]);
        this.keyDelay = [];
        this.keyDelayTime = 100;

        this.AiLoops = 100;

        this.waitWhenGameEnd = 100;
    }

    setup() {
        angleMode(DEGREES);

        //createCanvas(windowWidth, windowHeight);
        createCanvas(1024, 800);
        net = createDiv("NNet");

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

            this.nInput[i] = isNaN(val) ? 0 : 1;
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

        this.setAI(this.isAI);
        this.keyDelay = [];
    }

    setAI(ai) {
        this.isAI = ai;
        this.asteroids.isAI = ai;
    }

    getAI() {
        return this.asteroids.isAI;
    }

    /**
     * A = 65
     * B = 66
     * ...
     * Z = 90
     *
     * @param char
     * @returns {boolean}
     */
    execKey(char) {
        let code = char.charCodeAt(0);
        // Define 0 key delay fo code
        if (isNaN(this.keyDelay[code])) {
            this.keyDelay[code] = 0;
        }

        if (keyIsDown(code)) {
            //console.log("keyIsDown: " + char);
            //console.log("Key delay: " + this.keyDelay[code]);
            console.log(code + ' ' + this.keyDelay[code]);

            if (this.keyDelay[code] <= 0) {
                console.log("Key " + char + ' ' + code + ' ' + this.keyDelay[code]);
                this.keyDelay[code] = this.keyDelayTime;
                return true;
            }
        }
        this.keyDelay[code]--;
        return false;
    }

    update() {
        // Toggle AI
        if (this.execKey('A')) {
            this.setAI(!this.getAI());
        }

        // Randomize AI
        if (this.execKey('R')) {
            this.neuralNet.randomize();
            this.restart();
            let network = this.neuralNet.getState();
            net.html('<pre>' + JSON.stringify(network, null, "\t") + '</pre>');
        }

        // Toggle speed 100 - 1
        if (this.execKey('S')) {
            this.AiLoops = this.AiLoops !== 1 ? 1 : 100;
        }
        // Toggle speed 1000 - 1
        if (this.execKey('D')) {
            this.AiLoops = this.AiLoops !== 1 ? 1 : 1000;
        }

        if (this.getAI()) {
            for (var i = 0; i < this.AiLoops; i++) {
                this.mapResponse();
                this.neuralNet.forward();
                this.setAIActions();
                this.asteroids.update();
            }
        }
        else {
            this.asteroids.update();
        }
    }

    draw() {

        background(0);


        this.asteroids.draw();

        if (this.asteroids.outputs.dead || this.asteroids.outputs.won) {
            if (this.getAI()) {
                this.restart();
            }
            else {
                if (this.restartTicks == -1) {
                    this.restartTicks = this.waitWhenGameEnd;
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
        this.drawText();
    }

    drawText() {
        textAlign(LEFT);
        let scaleY = 20;

        fill(255, 255, 0, 90);
        rect(0, 0, width, height / scaleY);

        let textBottom = height / scaleY - scaleY / 2;
        text('AI A:toggle, R:randomize, Simulation S: x100; D: x1000 =' + this.AiLoops, 10, textBottom);


    }
}

let game = new Game();

function setup() {
    game.setup();
}

function draw() {
    game.update();
    game.draw();
}
