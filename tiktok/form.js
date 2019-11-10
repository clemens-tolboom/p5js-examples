class Form {
    constructor(patterns) {
        this.patterns = patterns;
        console.log('N',patterns.getNominators());
        console.log('D',patterns.getDenominators());
        console.log(patterns.getPatternsByNominator(nominator));
        console.log(patterns.getPatternsByDenominator(denominator));
      
      
        let that = this;
        let wrapper;

        this.root = createDiv();

        // Pattern
        wrapper = this.add(createDiv());
        this.add(createSpan("Pattern"), wrapper);
        this.pattern = this.add(createInput(pattern), wrapper);

        // BPM
        wrapper = this.add(createDiv());
        this.add(createSpan("BPM"), wrapper);
        // min, max, value, step
        this.bpmSlider = this.add(createSlider(10, 300, 120, 1), wrapper);
        this.bpmSlider.mousePressed(function () {
            that.bpmInput.value(that.bpmSlider.value());
        });

        this.bpmInput = this.add(createInput(120), wrapper);

        // Buttons
        wrapper = this.add(createDiv());
        
        this.stop = this.add(createButton('Stop'), wrapper);
        this.stop.mousePressed(function () {
            that.stopMetronome();
        });
        this.save = this.add(createButton('Change'), wrapper);
        this.save.mousePressed(function () {
            that.submit();
        });

        this.htmlForm();
    }

    // Add element to parent and return
    add(element, parent) {
        parent = parent || this.root;
        element.parent(parent);
        return element;
    }

    stopMetronome() {
        metronome.stop();
    }
    submit() {
        this.setPattern(this.pattern.value());
    }

    setPattern(pattern) {
        this.pattern.value(pattern);
        metronome.setPattern(pattern);
    }

    htmlForm() {
        let f = document.getElementById('form');
        let d = document.getElementById('patterns');
        d.addEventListener('change', e => {
            debugger;
            this.setPattern(e.target.value);
            return false;
        }, false);

        let items = this.patterns.getPatterns();

        for(var i = 0; i < items.length; i++) {
            var opt = document.createElement('option');
            let tiktok = this.patterns.patternToTikTok(items[i])
            opt.innerHTML = items[i] + " (" + tiktok + ")";
            opt.value = tiktok;
            d.appendChild(opt);
        }
    }
}
