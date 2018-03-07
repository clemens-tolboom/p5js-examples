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

        this.wins = 0;
        this.lost = 0;

        this.canvas = null;

    }

    setup() {
        angleMode(DEGREES);

        //createCanvas(windowWidth, windowHeight);
        this.canvas = createCanvas(1024, 800);
        //net = createDiv("NNet");

        this.restart();

        this.nInput = this.vectorizeInput();
        this.nOutput = this.vectorizeOutput();

        this.nNetProducer = new NeuralNetProducer(this.nInput, this.nOutput, [5]);
        this.genetics = new Species(this.nNetProducer, 25, 0.1, 0.01);

        this.nextSpecie()

        this.neuralNet.forward();

        this.canvas.mouseReleased(function(event){ game.mouseReleased(event)})
        this.canvas.mouseMoved(function(event){ game.mouseMoved(event)})
    }

    mouseReleased(event) {
        //console.log("Canvas mouse Released", event, mouseX, mouseY);
    }

    mouseMoved(event) {
        // if (event.clientY< 40) {
        //     fill(255,255,0);
        //     line(0,0, event.clientX, event.clientY);
        //     console.log("Canvas mouse Moved", event, event.clientX, event.clientY);
        // }
    }

    responseKeys() {
        return ['canFire', 'mass', 'rocks'
            , 'radar-0', 'radar-1', 'radar-2', 'radar-3'
            , 'radar-4', 'radar-5', 'radar-6', 'radar-7'
        ];
    }

    actionKeys() {
        return ['up', 'down', 'left', 'right', 'space'];
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

            this.nInput[i] = val;//isNaN(val) ? 0 : 1;
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
    }

    setAI(ai) {
        this.isAI = ai;
        this.asteroids.isAI = ai;
    }

    getAI() {
        return this.asteroids.isAI;
    }

    nextSpecie() {
        this.neuralNet = this.genetics.testSpecie().getItem();
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
            //console.log(code + ' ' + this.keyDelay[code]);

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
            //this.neuralNet.randomize();
            this.nextSpecie();
            this.restart();
            //let network = this.neuralNet.getState();
            // console.log(network);
            // console.log(JSON.stringify(network, null, "\t"));
            // // TODO: pressing arrows makes screen scroll (on Firefox)
            //net.html('<pre>' + JSON.stringify(network, null, "\t") + '</pre>');
        }

        // Toggle speed 100 - 1
        if (this.execKey('S')) {
            this.AiLoops = this.AiLoops !== 1 ? 1 : 100;
        }
        // Toggle speed 1000 - 1
        if (this.execKey('D')) {
            this.AiLoops = 1000;
        }

        if (this.execKey('F')) {
            this.AiLoops = 10000;
        }

        if (this.getAI()) {
            for (var i = 0; i < this.AiLoops; i++) {
                this.mapResponse();

                this.neuralNet.backward();
                this.neuralNet.forward();

                //console.log('nOut', this.neuralNet.output);

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
            if (this.asteroids.outputs.dead) {
                this.lost += 1;
            } else if (this.asteroids.outputs.won) {
                this.wins += 1;
            }

            if (this.getAI()) {
                let maxGames = 10;
                if (this.wins + this.lost === maxGames) {
                    let mass = this.asteroids.outputs.mass;
                    let score = this.wins + mass;
                    this.genetics.setScore(score);
                    this.wins = 0;
                    this.lost = 0;
                    this.nextSpecie();

                }
                this.restart();
            }
            else {
                // Pause some time
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
        var stats = 'AI A:toggle, R:randomize, Speed S,D,F =' + this.AiLoops + ' GA ' + this.genetics.getStatus();
        stats += ' Wins: ' + this.wins + ' Lost: ' + this.lost;
        text(stats, 10, textBottom);


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

class NeuralNetProducer {
    constructor(nInput, nOutput, aHiddenLayers) {
        this.nInput = nInput;
        this.nOutput = nOutput;
        this.aHiddenLayers = aHiddenLayers;
    }

    getOne() {
        this.nNet = new nNet(this.nInput, this.nOutput, this.aHiddenLayers);
        return this.nNet;
    }

    getClone(item) {
        let cloned = this.getOne();
        cloned.setState(item.getState());
        return cloned;
    }
}