class nRange {
    constructor(min, max, set) {
        this.min = min;
        this.max = max;
        if (set) {
            this.set = set;
        }
    }

    fromValue(input) {
        let result = input;
        if (result < this.min) {
            result = this.min;
        } else if (this.max < result) {
            result = this.max;
        }
        if (this.set) {
            let max = result;
            for(let v of this.set) {
                if (result>=v) {
                    max = v;
                }
            }
            result = max;
        }
        return result;
    }

}