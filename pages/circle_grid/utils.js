export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function cursorPosition(event, canvas) {
  // get scale
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // get mouse position
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  return [x, y];
}

export function dazzleVector([x, y], t, f = 10) {
  const dx = Math.cos(t) * f;
  const dy = Math.sin(t) * f;
  return [x + dx, y + dy];
}
