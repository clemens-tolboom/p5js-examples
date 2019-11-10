class Patterns {
    constructor() {
        this.patterns = [];
        this.buildPatterns();
    }

    buildPatterns() {
        let denominator = 1;
        while (denominator < 64) {
            let nominator = 1;
            while (nominator < 16 && nominator < denominator) {
                this.patterns.push(new Pattern(nominator, denominator));
                nominator++;
            }
            denominator *= 2;
        }
    }

    getPatternsByNominator(nominator) {
        return this.patterns.filter(pattern => pattern.nominator === nominator);
    }

    getPatternsByDenominator(denominator) {
        return this.patterns.filter(pattern => pattern.denominator === denominator);
    }

    getNominators() {
        let temp = this.patterns.map(pattern => pattern.nominator);
        return Array.from(new Set(temp));
    }

    getDenominators() {
        let temp = this.patterns.map(pattern => pattern.denominator);
        return Array.from(new Set(temp));
    }

    getPatterns() {
        let temp = this.getNominators().map(
            nominator => this.getPatternsByNominator(nominator)
        );
        temp = temp.map(ps => ps.map(p => p.getPatterns()));

        let result = [];
        temp.map(a => a.map(v => result.push(v)));

        temp = result;
        result = [];
        temp.map(a => a.map(v => result.push(v)));

        return Array.from(new Set(result));
    }

    patternToTikTok(p) {
        let result = "";
        p.split("").map((v,i) => result += (i===0 ? "1": "2" ) + (
            v === "1" ? "" : (
                v === "2" ? "3" : (
                    v === "3" ? "33" : "333"
                )
            )
        ));
        return result;
    }
}

