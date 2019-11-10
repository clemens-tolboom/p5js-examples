class Metronome {
    /**
     * Een metronome heeft een BPM en patroon.
     *
     * BPM bepaalt tempo
     *
     * @param {string} pattern '0.1.2.3.'
     *   . : stil
     *   - : houd aan?
     *   0,1,2,3,.. : bepaalde tik
     * @param {*} bpm 
     * @param {float} measure maatvoering
     *   3/4 7/8 heeft verband met patroon, maar wat?
     */
    constructor(pattern, bpm, measure) {
      this.setPattern(pattern);
      this.setBPM(bpm);
      this.setMeasure(0.7);
      this.time = 0;
  
      this.oscilator = new p5.Oscillator('Sinus');
      this.running = false;
      this.stopped = false;
    }

    setBPM(bpm) {
        this.bpm = bpm;
    }

    setMeasure(measure) {
        this.measure = measure;
    }

    setPattern(pattern) {
      this.pattern = pattern;
      this.current = 0;
    }

    tik() {
        time++;
    }

    next() {
      if (this.current + 1 < this.pattern.length) {
        this.current++;
      }
      else {
        this.current = 0;
      }
    }
  
    getNote() {
      return this.pattern[this.current];
    }
  
    play() {
      if (this.running) {
        return;
      }
      this.running = true;
  
      let note = this.getNote();
      //console.log(frameCount, note);
      if (note === '.') {
        // Doe niks
      }
      else {
        let freq = midiToFreq(notes[note]);
        this.oscilator.freq(freq);
        this.oscilator.start();
      }
      this.next();
    }
  
    stop() {
      this.running = false;
      this.oscilator.stop();
    }
  }
  