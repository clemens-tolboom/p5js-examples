class nRange {
    constructor(min, max, set) {
        this.min = min;
        this.max = max;
        if (set) {
            set.push(max+0.01);
            this.set = set;
        }
    }

    fromValue(input) {
        let result = input;
        if (result < this.min) {
            result = this.min;
        } else if (this.max < input) {
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