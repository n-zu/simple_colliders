import { world, reset } from "./gridWorld.js";
import { updateCircleRadius, updateDistance } from "./gridWorld.js";
import { updateFixed, updatePullForce } from "./gridWorld.js";

export let doRepel = false;
export let repelForce = 500;

export let doEnlarge = false;
export let enlargeMaxMul = 10;
export let enlargeForce = 2000;

export let doAntiEnlarge = false;
export let antiEnlargeMaxMul = 6;
export let antiEnlargeForce = 6;

const repelBtn = document.getElementById("repel");
const enlargeBtn = document.getElementById("enlarge");
const antiEnlargeBtn = document.getElementById("antiEnlarge");

const buttons = [repelBtn, enlargeBtn, antiEnlargeBtn];
const toggles = [
  (v) => {
    if (v !== undefined) doRepel = v;
    return doRepel;
  },
  (v) => {
    if (v !== undefined) doEnlarge = v;
    return doEnlarge;
  },
  (v) => {
    if (v !== undefined) doAntiEnlarge = v;
    return doAntiEnlarge;
  },
];

buttons.forEach((btn, i) => {
  btn.classList.add("outline");
  btn.onclick = () => {
    toggles[i](!toggles[i]());
    btn.classList.toggle("outline");

    // buttons.forEach((b, j) => {
    //   if (i == j) return;
    //   toggles[j](false);
    //   b.classList.add("outline");
    // });

    reset();
  };
});

const getters = {
  repel_force: () => repelForce,
  enlarge_force: () => enlargeForce,
  anti_enlarge_force: () => antiEnlargeForce,
  enlarge_max: () => enlargeMaxMul,
  anti_enlarge_max: () => antiEnlargeMaxMul,
};
const setters = {
  repel_force: (v) => {
    repelForce = v;
  },
  enlarge_force: (v) => {
    enlargeForce = v;
  },
  anti_enlarge_force: (v) => {
    antiEnlargeForce = v;
  },
  enlarge_max: (v) => {
    enlargeMaxMul = v;
  },
  anti_enlarge_max: (v) => {
    antiEnlargeMaxMul = v;
  },
};

// iterate key value pairs
Object.entries(setters).forEach(([key, setter]) => {
  const slider = document.getElementById(key);

  slider.value = getters[key]();
  slider.title = slider.value;

  slider.oninput = () => {
    setter(slider.value);
    slider.title = slider.value;
  };
});

const collisionsCheckbox = document.getElementById("collisions");
collisionsCheckbox.onchange = () => {
  if (!world) return;
  updateFixed(!collisionsCheckbox.checked);
};

const radiusSlider = document.getElementById("radius");
radiusSlider.oninput = () => {
  if (!world) return;
  updateCircleRadius(Number(radiusSlider.value));
};

const distanceSlider = document.getElementById("distance");
distanceSlider.oninput = () => {
  if (!world) return;
  updateDistance(Number(distanceSlider.value));
};

const pullForceSlider = document.getElementById("pull_force");
pullForceSlider.oninput = () => {
  if (!world) return;
  updatePullForce(Number(pullForceSlider.value));
};

window.onload = () => {
  repelBtn.click();
};
