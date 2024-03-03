import Circle from "../../../js/circle.js";
import Line from "../../../js/line.js";
import World from "../../../js/world.js";
import Sound from "../js/sound/src/sound.js";

const canvas = document.getElementById("canvas");
const energy = document.getElementById("energy");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// set color to white
ctx.strokeStyle = "white";

const world = new World(canvas.width, canvas.height).setWallCollisions(false);

const l1 = new Line(
  [0, canvas.height * 0.2],
  [canvas.width / 2, canvas.height * 0.4]
)
  .setFixed()
  .setMass(9999);

const l2 = new Line(
  [canvas.width, canvas.height * 0.6],
  [canvas.width / 2, canvas.height * 0.8]
)
  .setFixed()
  .setMass(9999);

world.addLine(l1);
world.addLine(l2);

function gravitational_pull(pull) {
  // reduce the speed of all the circles by a percentage
  // if it is < 0.1 delete it

  world.circles.forEach((circle) => {
    circle.v[1] += pull;
    const terminal = 500;
    if (circle.v[1] > terminal) circle.v[1] = terminal;
  });

  world.circles = world.circles.filter((circle) => {
    const keep = circle.p[1] < canvas.height;

    if (keep) return keep;

    const sound = Sound.fromFrequency(100 / circle.mass);
    sound.play();
  });
}

function loop() {
  gravitational_pull(15);
  world.update(1 / 60);
  world.draw(ctx);

  energy.innerText = world.energy().toPrecision(3);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

const createRandomCircle = () => {
  if (world.circles.length > 30) {
    ctx.strokeStyle = "red";
    setTimeout(() => {
      ctx.strokeStyle = "white";
      createRandomCircle();
    }, 2000);
    return;
  }

  const mass = (Math.random() + 1) / 2;

  const p0 = [Math.random() * canvas.width, 0];

  const c = new Circle(p0, 50 * mass).setMass(mass);

  world.addCircle(c);

  setTimeout(createRandomCircle, 500);
};
createRandomCircle();
