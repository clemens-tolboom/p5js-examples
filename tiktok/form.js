class Form {
    // getBPM
    // get/setCustomPatterns
    constructor(patterns, receiver) {
        this.patterns = patterns;
        console.log('N', patterns.getNominators());
        console.log('D', patterns.getDenominators());
        console.log(patterns.getPatternsByNominator(nominator));
        console.log(patterns.getPatternsByDenominator(denominator));


        this.receiver = receiver;
        let that = this;
        let wrapper;

        this.root = this.add(createDiv(), "#form");

        // Pattern
        wrapper = this.add(createDiv());
        this.add(createSpan("Pattern"), wrapper);
        this.pattern = this.add(createInput(pattern), wrapper);

        // BPM
        wrapper = this.add(createDiv());
        this.add(createSpan("BPM"), wrapper);
        // min, max, value, step
        this.bpmSlider = this.add(createSlider(10, 300, 120, 1), wrapper);
        this.bpmSlider.mouseReleased(function () {
            that.bpmInput.value(that.bpmSlider.value());
            that.receiver("form.bpm", that.bpmSlider.value());
        });

        this.bpmInput = this.add(createInput(120), wrapper);

        // Buttons
        wrapper = this.add(createDiv());

        this.stop = this.add(createButton('Stop'), wrapper);
        this.stop.mousePressed(function () {
            that.stopMetronome();
            that.receiver("form.stop");
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
        this.patternDisplay(pattern);
    }

    patternDisplay(pattern) {
        if ('content' in document.createElement('template')) {
            let target = document.querySelector("tbody tr");
            while (target.hasChildNodes()) {
                target.removeChild(target.lastChild);
            }

            const template = document.querySelector('#beat');
            let clone;
            pattern.split("").map(s => {
                clone = document.importNode(template.content, true);
                target.appendChild(clone);
                let el = target.lastElementChild;
                if (s === "1") {
                    el.className = el.className + " on third";
                } else if (s === "2") {
                    el.className = el.className + " on second";
                } else if (s === "3") {
                    el.className = el.className + " on first";
                }
            });
        } else {
            // Find another way to add the rows to the table because 
            // the HTML template element is not supported.
        }
    }

    showActive() {
        let current = metronome.current;
        if (this.lastBeat !== current) {
            this.lastBeat = current;
            let target = document.querySelector("tbody tr");
            console.log(current);

            for (let i = 0; i < target.children.length; i++) {
                target.children[i].className = target.children[i].className.replace(" hit", '');
            }
            target.children[current].className = target.children[current].className + " hit";
        }
    }

    htmlForm() {
        let f = document.getElementById('form');
        let d = document.getElementById('patterns');
        d.addEventListener('change', e => {
            this.setPattern(e.target.value);
            return false;
        }, false);

        let items = this.patterns.getPatterns();

        for (var i = 0; i < items.length; i++) {
            var opt = document.createElement('option');
            let tiktok = this.patterns.patternToTikTok(items[i])
            opt.innerHTML = items[i] + " (" + tiktok + ")";
            opt.value = tiktok;
            d.appendChild(opt);
        }
    }
}
