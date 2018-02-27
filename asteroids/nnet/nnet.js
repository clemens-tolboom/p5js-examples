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

            for (var i = 1; i < hiddenDims.length; i++) {
                m = new Matrix(hiddenDims[i - 1], hiddenDims[i]);
                m.input = this.matrices[i - 1].output;

                this.matrices.push(m);
            }

            m = new Matrix(hiddenDims[hiddenDims.length - 1], output.length);
            m.input = this.matrices[this.matrices.length - 1].output;
            m.output = output;

            this.matrices.push(m);
        }

        for (let m of this.matrices) {
            m.randomize();
        }
    }

    forward() {
        for (let m of this.matrices) {
           m.forward();
        }
    }
}

class Matrix {
    constructor(row, col) {
        let a = new Array(row);
        for (let i = 0; i < row; i++) {
            a[i] = new Array(4);
            for (let j = 0; j < col; j++) {
                a[i][j] = '[' + i + ', ' + j + ']';
            }
        }
        this.matrix = a;
        this.output = new Array(col);
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

    randomize() {
        let a = this.matrix;
        let row = a.length;
        let col = a[0].length;

        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                a[i][j] = random();
            }
        }
    }
}