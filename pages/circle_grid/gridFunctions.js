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
