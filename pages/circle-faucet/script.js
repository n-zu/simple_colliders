import Circle from "../../../js/circle.js";
import World from "../../../js/world.js";
import Sound from "../js/sound/src/sound.js";

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
    circle.v[0] *= percentage;
    circle.v[1] *= percentage;
  });

  world.circles = world.circles.filter((circle) => {
    const [vx, vy] = circle.v;
    const keep = Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1;

    if (keep) return keep;

    const sound = Sound.fromFrequency(100 / circle.mass);
    sound.play();
  });
}

function loop() {
  world.update(1 / 60);
  world.draw(ctx);

  decay(0.95);

  energy.innerText = world.energy().toPrecision(3);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

const createRandomCircle = () => {
  if (world.circles.length > 100) {
    ctx.strokeStyle = "red";
    setTimeout(() => {
      ctx.strokeStyle = "white";
      createRandomCircle();
    }, 2000);
    return;
  }

  const mass =
    Math.random() * Math.random() + Math.random() * Math.random() + 0.3;

  const speed = 3000;

  const velocity = [
    ((Math.random() * 1 - 0.5) * speed) / mass,
    ((Math.random() * 1 - 0.5) * speed) / mass,
  ];

  const c = new Circle([canvas.width / 2, canvas.height / 2], 50 * mass)
    .setVelocity(velocity)
    .setMass(mass);

  world.addCircle(c);

  setTimeout(createRandomCircle, 200);
};
createRandomCircle();
