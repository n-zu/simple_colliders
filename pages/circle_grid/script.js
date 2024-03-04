import { world, initWorld } from "./gridWorld.js";
import { cursorPosition, dazzleVector } from "./utils.js";
import { repel, antiEnlarge, enlarge, playSound } from "./gridFunctions.js";

import { doRepel, repelForce } from "./ui.js";
import { doAntiEnlarge, antiEnlargeMaxMul, antiEnlargeForce } from "./ui.js";
import { doEnlarge, enlargeMaxMul, enlargeForce } from "./ui.js";

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.strokeStyle = "white";

initWorld(canvas, 10, 5);

var cursor = [0, 0];

canvas.onmousemove = function (e) {
  cursor = cursorPosition(e, canvas);
};

function handleCursor(t) {
  const pos = dazzleVector(cursor, t / 1000, 2);
  world.circles.forEach((circle) => {
    doRepel && repel(circle, pos, repelForce);
    doAntiEnlarge &&
      antiEnlarge(
        circle,
        pos,
        world.circle_radius,
        antiEnlargeMaxMul,
        antiEnlargeForce
      );
    doEnlarge &&
      enlarge(circle, pos, world.circle_radius, enlargeMaxMul, enlargeForce);

    playSound(circle, pos);
  });
}

function loop(t) {
  world.pull();
  handleCursor(t);
  world.update(1 / 60);
  world.draw(ctx);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
