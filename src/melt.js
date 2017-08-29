import Combokeys from 'combokeys';

export default function Melt() {
  let sample, sample2;
  let keys = new Combokeys(document.documentElement);
  function playAudio() {
    if (!sample) {
      sample = new Audio('src/audio/420.mp3');
      sample2 = new Audio('src/audio/420.mp3');
    }
    sample.play();
    sample2.play();
    melt();
  }

  let filter = document.querySelector('feDisplacementMap');
  let countup = true;
  let active = false;

  function melt() {
    active = true;
    let count = 0;
    let spd = 1;
    let freq;
    let avg;
    let audioSrc;
    let analyser;

    //
    let ctx = new AudioContext();
    let audio = sample;
    if (audioSrc === undefined) {
      audioSrc = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      audioSrc.connect(analyser);
    }

    let frequencyData = new Uint8Array(analyser.frequencyBinCount);

    function step() {
      if (!sample.paused) window.requestAnimationFrame(step);

      analyser.getByteFrequencyData(frequencyData);

      freq = frequencyData.reduce((a, b) => {
        return a + b;
      });

      avg = Math.floor(freq / frequencyData.length) * 2;

      if (active) {
        if (countup) {
          count += spd;
          if (count >= 244) {
            countup = false;
          }
        } else {
          count -= spd;
          if (count <= 0) {
            countup = true;
            active = false;
          }
        }
      }

      filter.setAttribute('scale', avg);
    }

    step();
  }

  // melt()
  // meltkeys.bind('m', melt)
  playAudio();
}
