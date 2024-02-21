import Circle from "../../../js/circle.js";
import World from "../../../js/world.js";
import Sound from "../sound/src/sound.js";

const canvas = document.getElementById("canvas");
const energy = document.getElementById("energy");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// set color to white
ctx.strokeStyle = "white";

const world = new World(canvas.width, canvas.height);

function decay(percentage) {
  // reduce the speed of all the circles by a percentage
  // if it is < 0.1 delete it

  world.circles.forEach((circle) => {
    circle.vx *= percentage;
    circle.vy *= percentage;
  });

  world.circles = world.circles.filter((circle) => {
    const keep = Math.abs(circle.vx) > 0.1 || Math.abs(circle.vy) > 0.1;

    if (keep) return keep;

    const sound = Sound.fromFrequency(100 / circle.mass);
    sound.play();
  });
}

function loop() {
  world.update(1 / 60);
  world.draw(ctx);

  decay(0.995);

  energy.innerText = world.energy().toPrecision(3);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

canvas.onclick = function (e) {
  const mass =
    Math.random() * Math.random() + Math.random() * Math.random() + 0.3;

  const c = new Circle(e.clientX, e.clientY, 50 * mass)
    .setVelocity(
      (Math.random() * 1000 - 500) / mass,
      (Math.random() * 1000 - 500) / mass
    )
    .setMass(mass);

  world.addCircle(c);
};
