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
            let chain = this.input;

            m = new Matrix(this.input.length, this.output.length);
            this.matrices.push(m);

            m.input = chain;
            chain = m.output;

            m = new ReLu(chain.length);
            this.matrices.push(m);

            m.input = chain;
            m.output = this.output;
        }
        else {
            let chain = this.input;

            m = new Matrix(input.length, hiddenDims[0]);
            this.matrices.push(m);

            m.input = input;
            chain = m.output;

            m = new Sigmoid(chain.length);
            this.matrices.push(m);

            m.input = chain;
            chain = m.output;

            for (var i = 1; i < hiddenDims.length; i++) {
                m = new Matrix(hiddenDims[i - 1], hiddenDims[i]);
                this.matrices.push(m);

                m.input = chain;
                chain = m.output;

                m = new Sigmoid(chain.length);
                this.matrices.push(m);

                m.input = chain;
                chain = m.output;
            }

            m = new Matrix(hiddenDims[hiddenDims.length - 1], output.length);
            this.matrices.push(m);

            m.input = chain;
            chain = m.output;

            m = new ReLu(chain.length);
            this.matrices.push(m);

            m.input = chain;
            m.output = this.output;
        }

        if (this.matrices[0].input !== this.input) {
            console.log(m, m.getState(), this.m.getState());
            throw('Invalid lineage for input.');
        }

        var chain = this.input;
        for (let m of this.matrices) {
            if (m.input !== chain) {
                console.log(m, m.getState(), this.m.getState());
                throw("Invalid lineage for chaining.");
            }
            chain = m.output;
        }
        if (this.matrices[this.matrices.length - 1].output !== this.output) {
            console.log(m, m.getState(), this.m.getState());
            throw("Invalid lineage for output.");
        }

        this.randomize();
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

    backward() {
        for(var m of this.matrices) {
            m.backward();
        }
    }

    getState() {
        let result = [];
        for (let m of this.matrices) {
            result.push(m.getState());
        }
        return result;
    }

    setState(state) {
        for (let i = 0; i < state.length; i++) {
            let m = this.matrices[i];
            m.setState(state[i]);
        }

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
            output[i] = (input[i] >= 0 ? input[i] : 0);
        }
    }

    backward() {}

    getState() {
        return {
            type: 'ReLu'
        };
    }

    setState(state) {
        // NOP
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

    backward() {};

    getState() {
        return {
            type: 'Sigmoid'
        };
    }

    setState(state) {
        // NOP
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
        this.bias = new Array(cols);
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
            out[col] = result + this.bias[col];
        }
    }

    backward() {
        // adjust matrix

        // adjust bias
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
        let b = this.bias;
        let row = a.length;
        let col = a[0].length;

        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                a[i][j] = this.getRandomArbitrary(-1, 1);
                b[j] = this.getRandomArbitrary(-1, 1);
            }
        }
    }

    getState() {
        return {
            type: 'matrix',
            dims: [this.matrix.length, this.matrix[0].length],
            matrix: this.matrix,
            bias: this.bias
        }
    }

    setState(state) {
        if (state.type !== 'Matrix') {
            throw 'State ' + state.type + ' is not a matrix';
        }

        let a = this.matrix;
        let b = this.bias;
        let row = a.length;
        let col = a[0].length;

        this.matrix = state.matrix;
        this.bias = state.bias.clone();
        for (var j = 0; j < col; j++) {
            b[j] = state.bias;
        }
    }
}
