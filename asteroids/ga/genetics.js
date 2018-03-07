class Species {
    constructor(producer, numSpecies, crossoverRate, mutationRate) {
        this.producer = producer;

        this.species = new Array(numSpecies);
        this.crossoverRate = crossoverRate;
        this.mutationRate = mutationRate;

        this.generation = 0;
        this.currentSpecie = 0;

        this.initGeneration();
    }

    getStatus() {
        return this.generation + ' / ' + this.currentSpecie;
    }

    setScore(score) {
        let specie = this.species[this.currentSpecie];
        specie.setScore(score);
    }

    testSpecie() {
        let specie = this.species[this.currentSpecie];

        this.currentSpecie++;

        if (this.currentSpecie == this.species.length) {
            // We are out of species so generate next generation.
            this.currentSpecie = 0;
            this.generation++;

            this.newGeneration();
            return this.testSpecie();
        }

        return specie;
    }

    initGeneration() {
        for (var i = 0; i < this.species.length; i++) {
            var item = this.producer.getOne()
            this.species[i] = new Specie(item);
        }
    }

    newGeneration() {
        let totalScore = this.species.map(item => item.getScore()).reduce((accumulator, score) => accumulator + score);

        this.species.map((item) => item.setFitness(item.score / totalScore));

        console.log('Generation ' + totalScore);
    }
}

class Specie {
    constructor(item) {
        this.setFitness(0.0);
        this.setScore(-1);

        this.setItem(item);
    }

    setFitness(fitness) {
        this.fitness = fitness;
    }

    getFitness() {
        return this.fitness;
    }

    setScore(score) {
        this.score = score;
    }
    getScore() {
        return this.score;
    }

    getItem() {
        return this.item;
    }

    setItem(item) {
        this.item = item;
    }

    getClone(producer) {
        var n = new Specie();

        n.setItem(producer.getClone(this.getItem()));

        return n;
    }

    crossOver(producer, other, crossOverrate) {
        if (Math.random() < crossOverrate) {
            producer.crossOver(this.getItem());
        }

    }

    mutate(producer, mutateRate) {
        if (Math.random() < mutateRate) {
            producer.mutate(this.getItem());
        }
    }
}