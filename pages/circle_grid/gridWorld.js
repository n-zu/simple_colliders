import Circle from "../../../js/circle.js";
import World from "../../../js/world.js";
import { lerp } from "./utils.js";

export var world;

function pull_circles(world) {
  world.circles.forEach((circle) => {
    if (!circle.p0) return;
    const p = circle.p;
    const p0 = circle.p0;

    const x = lerp(p[0], p0[0], world.pullForce);
    const y = lerp(p[1], p0[1], world.pullForce);

    circle.p = [x, y];
  });
}

function setupWorld(
  canvas,
  circle_radius = 10,
  distance = 5,
  fixed = true,
  pullForce = 0.1
) {
  const world = new World(canvas.width, canvas.height).setWallCollisions(false);

  let x0 = 0;
  let y0 = 0;
  while (y0 < canvas.height + 2 * circle_radius + distance) {
    x0 = 0;
    while (x0 < canvas.width + 2 * circle_radius + distance) {
      const circle = new Circle([x0, y0], circle_radius, distance).setFixed(
        fixed
      );
      circle.p0 = [x0, y0];
      world.addCircle(circle);
      x0 += 2 * circle_radius + distance;
    }
    y0 += 2 * circle_radius + distance;
  }

  world.circle_radius = circle_radius;
  world.distance = distance;
  world.canvas = canvas;
  world.fixed = fixed;
  world.pullForce = pullForce;
  world.pull = () => pull_circles(world);

  return world;
}

export function initWorld(canvas, circle_radius = 10, distance = 5) {
  world = setupWorld(canvas, circle_radius, distance, true);
}

export const updateCircleRadius = (radius) => {
  world = setupWorld(world.canvas, radius, world.distance, world.fixed);
};

export const updateDistance = (distance) => {
  world = setupWorld(world.canvas, world.circle_radius, distance, world.fixed);
};

export const updateFixed = (fixed) => {
  world.circles.forEach((circle) => {
    circle.setFixed(fixed);
  });
  world.fixed = fixed;
};

export const updatePullForce = (force) => {
  world.pullForce = force;
};

export const reset = () => {
  world = setupWorld(
    world.canvas,
    world.circle_radius,
    world.distance,
    world.fixed
  );
};
