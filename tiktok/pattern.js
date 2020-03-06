class Pattern {
    constructor(nominator, denominator) {
        this.nominator = nominator;
        this.denominator = denominator;
        this.permutations = [];
        this.buildPattern();
    }

    buildPattern() {
        this.permutations = [];
        let groups = this.getGroups();
        for (let group of groups) {
            let perms = this.getPerms(group);
            perms.map(v => this.permutations.push(v));
        }
    }

    getPatterns() {
        return this.permutations;
    }

    /**
     * Calculate unique permutations of a.
     *
     * @param {array} a 
     *
     * @return {[string]}
     */
    getPerms(a) {
        // https://stackoverflow.com/questions/37579994/generate-permutations-of-javascript-array/57432813#57432813
        const perm = a => a.length ? a.reduce((r, v, i) => [...r, ...perm([...a.slice(0, i), ...a.slice(i + 1)]).map(x => [v, ...x])], []) : [[]]
        let perms = perm(a);

        // Inject into hash table
        let o = {};
        for (const p in perms) {
            let key = perms[p].join("");
            o[key] = 1;
        }

        perms = [];
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                perms.push(key);
            }
        }
        perms.sort();
        return perms;
    }

    getGroups() {
        let result = [];
        switch (this.nominator) {
            case 1:
                result = [[1]];
                break;

            case 2:
                result = [[2]];
                break;

            case 3:
                result = [[3]];
                break;

            case 4:
                result = [[4]];
                break;

            case 5:
                result = [[2, 3]];
                break;

            case 6:
                result = [[3, 3]];
                break;

            case 7:
                result = [[2, 2, 3]];
                break;

            case 8:
                result = [[2, 3, 3]];
                break;

            case 9:
                result = [
                    [3, 3, 3],
                    [2, 2, 2, 3]
                ];
                break;

            case 10:
                result = [
                    [2, 2, 3, 3]
                ];
                break;

            case 11:
                result = [
                    [2, 3, 3, 3]
                ];
                break;

            case 12:
                result = [
                    [3, 3, 3, 3],
                    [2, 2, 2, 3, 3]
                ];
                break;

            case 13:
                result = [
                    [3, 3, 3, 4]
                ];
                break;

            case 14:
                result = [
                    [2, 3, 3, 3, 3]
                ];
                break;

            case 15:
                result = [
                    [3, 4, 4, 4]
                ];
                break;

            default:
                break;
        }

        return result;
    }
}
