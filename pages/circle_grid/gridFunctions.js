import Sound from "../js/sound/src/sound.js";
import { map2 } from "./utils.js";

function getDistance(circle, [px, py]) {
  const [x, y] = circle.p;
  const [dx, dy] = [px - x, py - y];
  return Math.sqrt(dx * dx + dy * dy);
}

export function repel(circle, [px, py], force = 100) {
  const [x, y] = circle.p;
  const [dx, dy] = [px - x, py - y];
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const speed = (force * 100) / distance;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  circle.v[0] = -vx;
  circle.v[1] = -vy;
}
export function antiEnlarge(circle, pointer, r0, maxMul = 10, force = 10) {
  const distance = getDistance(circle, pointer);
  const r = Math.min(r0 + distance / force, r0 * maxMul);
  circle.r = r;
}
export function enlarge(circle, pointer, r0, maxMul = 10, force = 2000) {
  const distance = getDistance(circle, pointer);
  const r = Math.min(r0 + force / distance, r0 * maxMul);
  circle.r = r;
}

export function playSound(circle, pointer) {
  const distance = getDistance(circle, pointer);
  if (distance > 2 * circle.r) return;

  let frequency = 600 - circle.r * 20;
  frequency += pointer[0] / 3 + pointer[1] / 3;
  frequency /= 2;
  frequency = Math.max(200, Math.min(2000, frequency));
  const volume = Math.min(0.5, ((0.6 / distance) * 600) / frequency);

  const sound = Sound.fromFrequency(frequency, {
    volume: volume,
    duration: 0.1,
    healthCheck: false,
  });
  sound.play();
}
