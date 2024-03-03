import Circle from "./circle.js";
import { Vector2 } from "./types.js";

class Line {
  p1: Vector2;
  p2: Vector2;

  mass: number = 1;
  v: Vector2 = [0, 0];

  fixed: boolean = false;

  constructor(p1: Vector2 = [0, 0], p2: Vector2 = [0, 1]) {
    this.p1 = p1;
    this.p2 = p2;
  }

  copy() {
    return new Line(this.p1, this.p1)
      .setVelocity(this.v)
      .setMass(this.mass)
      .setFixed(this.fixed);
  }

  setMass(mass: number) {
    this.mass = mass;
    return this;
  }

  setVelocity(velocity: Vector2) {
    this.v = velocity;
    return this;
  }

  setFixed(fixed: boolean = true) {
    this.fixed = fixed;
    return this;
  }

  energy() {
    return 0.5 * this.mass * (this.v[0] * this.v[0] + this.v[1] * this.v[1]);
  }

  update(dt: number) {
    this.p1[0] += this.v[0] * dt;
    this.p1[1] += this.v[1] * dt;

    this.p2[0] += this.v[0] * dt;
    this.p2[1] += this.v[1] * dt;
    return this;
  }

  _checkCircleCollision(other: Circle): Vector2 | null {
    const x1 = this.p1[0];
    const y1 = this.p1[1];
    const x2 = this.p2[0];
    const y2 = this.p2[1];
    const x3 = other.p[0];
    const y3 = other.p[1];
    const r = other.r;

    const u =
      ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) /
      ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    const closestPoint: Vector2 =
      u < 0
        ? [x1, y1]
        : u > 1
        ? [x2, y2]
        : [x1 + u * (x2 - x1), y1 + u * (y2 - y1)];

    const dx = closestPoint[0] - x3;
    const dy = closestPoint[1] - y3;
    const distance2 = dx * dx + dy * dy;
    if (distance2 < r * r) {
      return closestPoint;
    }
    return null;
  }

  collideWithCircle(circle: Circle) {
    const collisionPoint = this._checkCircleCollision(circle);
    if (!collisionPoint) return;

    const dx = collisionPoint[0] - circle.p[0];
    const dy = collisionPoint[1] - circle.p[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / distance;
    const ny = dy / distance;

    const tx = -ny;
    const ty = nx;

    const dpTan1 = this.v[0] * tx + this.v[1] * ty;
    const dpTan2 = circle.v[0] * tx + circle.v[1] * ty;

    const dpNorm1 = this.v[0] * nx + this.v[1] * ny;
    const dpNorm2 = circle.v[0] * nx + circle.v[1] * ny;

    const m1 =
      (dpNorm1 * (this.mass - circle.mass) + 2 * circle.mass * dpNorm2) /
      (this.mass + circle.mass);
    const m2 =
      (dpNorm2 * (circle.mass - this.mass) + 2 * this.mass * dpNorm1) /
      (this.mass + circle.mass);

    const overlap = circle.r - distance;

    if (!this.fixed) {
      this.v[0] = tx * dpTan1 + nx * m1;
      this.v[1] = ty * dpTan1 + ny * m1;
    }
    if (!circle.fixed) {
      circle.v[0] = tx * dpTan2 + nx * m2;
      circle.v[1] = ty * dpTan2 + ny * m2;
      circle.p[0] -= nx * overlap * 0.5;
      circle.p[1] -= ny * overlap * 0.5;
    }
  }

  collideWithWalls(width: number, height: number) {
    if (this.fixed) return;
    const pointCollide = (p: Vector2) => {
      if (p[0] < 0) {
        this.v[0] = Math.abs(this.v[0]);
      }
      if (p[0] > width) {
        this.v[0] = -Math.abs(this.v[0]);
      }
      if (p[1] < 0) {
        this.v[1] = Math.abs(this.v[1]);
      }
      if (p[1] > height) {
        this.v[1] = -Math.abs(this.v[1]);
      }
    };
    pointCollide(this.p1);
    pointCollide(this.p2);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.p1[0], this.p1[1]);
    ctx.lineTo(this.p2[0], this.p2[1]);
    ctx.stroke();
  }
}

export default Line;
