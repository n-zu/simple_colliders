import { Vector2 } from "./types.js";

class Circle {
  p: Vector2;
  r: number;

  mass: number = 1;
  v: Vector2 = [0, 0];

  fixed: boolean = false;

  constructor(position: Vector2 = [0, 0], r: number = 1) {
    this.p = position;
    this.r = r;
  }

  copy() {
    return new Circle(this.p, this.r)
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

  setFixed(fixed: boolean) {
    this.fixed = fixed;
    return this;
  }

  energy() {
    return 0.5 * this.mass * (this.v[0] * this.v[0] + this.v[1] * this.v[1]);
  }

  update(dt: number) {
    this.p[0] += this.v[0] * dt;
    this.p[1] += this.v[1] * dt;
    return this;
  }

  _checkCircleCollision(other: Circle): boolean {
    const dx = this.p[0] - other.p[0];
    const dy = this.p[1] - other.p[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    const colliding = distance < this.r + other.r;
    const notFixed = !this.fixed || !other.fixed;
    return colliding && notFixed;
  }

  collideWithCircle(other: Circle) {
    if (!this._checkCircleCollision(other)) {
      return;
    }

    const dx = this.p[0] - other.p[0];
    const dy = this.p[1] - other.p[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / distance;
    const ny = dy / distance;

    const tx = -ny;
    const ty = nx;

    const dpTan1 = this.v[0] * tx + this.v[1] * ty;
    const dpTan2 = other.v[0] * tx + other.v[1] * ty;

    const dpNorm1 = this.v[0] * nx + this.v[1] * ny;
    const dpNorm2 = other.v[0] * nx + other.v[1] * ny;

    const m1 =
      (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) /
      (this.mass + other.mass);
    const m2 =
      (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) /
      (this.mass + other.mass);

    const overlap = this.r + other.r - distance;

    if (!this.fixed) {
      this.v[0] = tx * dpTan1 + nx * m1;
      this.v[1] = ty * dpTan1 + ny * m1;
      this.p[0] += (nx * overlap) / 2;
      this.p[1] += (ny * overlap) / 2;
    }
    if (!other.fixed) {
      other.v[0] = tx * dpTan2 + nx * m2;
      other.v[1] = ty * dpTan2 + ny * m2;
      other.p[0] -= (nx * overlap) / 2;
      other.p[1] -= (ny * overlap) / 2;
    }
  }

  collideWithWalls(width: number, height: number) {
    if (this.fixed) return;
    if (this.p[0] - this.r < 0) {
      this.v[0] = Math.abs(this.v[0]);
      this.p[0] = this.r;
    }
    if (this.p[0] + this.r > width) {
      this.v[0] = -Math.abs(this.v[0]);
      this.p[0] = width - this.r;
    }
    if (this.p[1] - this.r < 0) {
      this.v[1] = Math.abs(this.v[1]);
      this.p[1] = this.r;
    }
    if (this.p[1] + this.r > height) {
      this.v[1] = -Math.abs(this.v[1]);
      this.p[1] = height - this.r;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.p[0], this.p[1], this.r, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

export default Circle;
