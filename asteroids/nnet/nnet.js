class nInput {

}

class nOutput {

}

class nNet {
    /**
     *
     * @param Array input
     * @param Array output
     * @param Array hiddenDims
     */
    constructor(input, output, hiddenDims) {
        this.input = input;
        this.output = output;

        this.hiddenDims = hiddenDims;

        this.matrices = [];

        let m;

        if (hiddenDims.length === 0) {
            m = new Matrix(input.length, output.length);
            m.input = input;
            m.output = output;

            this.matrices.push(m);
        }
        else {
            m = new Matrix(input.length, hiddenDims[0]);
            m.input = input;
            this.matrices.push(m);
            let chain = m.output;

            chain = this.addSigmoid(chain);

            for (var i = 1; i < hiddenDims.length; i++) {
                m = new Matrix(hiddenDims[i - 1], hiddenDims[i]);
                m.input = chain;
                chain = m.output;
                this.matrices.push(m);

                chain = this.addSigmoid(chain);
            }

            m = new Matrix(hiddenDims[hiddenDims.length - 1], output.length);
            m.input = this.matrices[this.matrices.length - 1].output;
            m.output = output;

            this.matrices.push(m);

            chain = this.addReLu(m.output);
        }

        this.randomize();
    }

    addSigmoid(chain) {
        let m = new Sigmoid(chain.length);
        m.input = chain;
        this.matrices.push(m);
        return m.output;
    }

    addReLu(chain) {
        let m = new ReLu(chain.length);
        m.input = chain;
        this.matrices.push(m);
        return m.output;
    }

    randomize() {
        for (let m of this.matrices) {
            if (m instanceof Matrix) {
                m.randomize();
            }
        }
    }

    forward() {
        for (let m of this.matrices) {
            m.forward();
        }
    }

    getState() {
        let result = [];
        for (let m of this.matrices) {
            result.push(m.getState());
        }
        return result;
    }
}

class ReLu {
    constructor(rows) {
        this.output = new Array(rows);
    }

    forward() {
        let input = this.input;
        let output = this.output;

        let rows = output.length;
        for (let i = 0; i < rows; i++) {
            output[i] = (input[i] >= 0 ? 0 : input[i]);
        }
    }

    getState() {
        return {
            state: 'ReLu'
        };
    }
}

class Sigmoid {
    constructor(rows) {
        this.output = new Array(rows);
    }

    forward() {
        let input = this.input;
        let output = this.output;

        let rows = output.length;
        for (let i = 0; i < rows; i++) {
            output[i] = 1 / (1 + Math.exp(-input[i]));
        }
    }

    getState() {
        return {
            state: 'Sigmoid'
        };
    }

}

class Matrix {
    constructor(rows, cols) {
        // Build 2 dimensional array
        let a = new Array(rows);
        for (let i = 0; i < rows; i++) {
            a[i] = new Array(4);
            for (let j = 0; j < cols; j++) {
                a[i][j] = '[' + i + ', ' + j + ']';
            }
        }
        this.matrix = a;
        this.output = new Array(cols);
    }

    forward() {
        let input = this.input;
        let out = this.output;

        let m = this.matrix;
        let rows = m.length;
        let cols = m[0].length;

        for (let col = 0; col < cols; col++) {
            let result = 0;
            for (let row = 0; row < rows; row++) {
                result += m[row][col] * input[row];
            }
            out[col] = result;
        }
    }

    getRandom() {
        return Math.random();
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    randomize() {
        let a = this.matrix;
        let row = a.length;
        let col = a[0].length;

        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                a[i][j] = this.getRandomArbitrary(-1, 1);
            }
        }
    }

    getState() {
        return {
            type: 'matrix',
            dims: [this.matrix.length, this.matrix[0].length],
            value: this.matrix
        }
    }
}
