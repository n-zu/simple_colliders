class Circle {
  x: number;
  y: number;
  r: number;

  mass: number = 1;
  vx: number = 0;
  vy: number = 0;

  fixed: boolean = false;

  constructor(x: number = 0, y: number = 0, r: number = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  copy() {
    return new Circle(this.x, this.y, this.r)
      .setVelocity(this.vx, this.vy)
      .setMass(this.mass)
      .setFixed(this.fixed);
  }

  setMass(mass: number) {
    this.mass = mass;
    return this;
  }

  setVelocity(vx: number, vy: number) {
    this.vx = vx;
    this.vy = vy;
    return this;
  }

  setFixed(fixed: boolean) {
    this.fixed = fixed;
    return this;
  }

  energy() {
    return 0.5 * this.mass * (this.vx * this.vx + this.vy * this.vy);
  }

  update(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    return this;
  }

  _checkCircleCollision(other: Circle) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const colliding = distance < this.r + other.r;
    const notFixed = !this.fixed || !other.fixed;
    return colliding && notFixed;
  }

  collideWithCircle(other: Circle) {
    if (!this._checkCircleCollision(other)) {
      return;
    }

    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let nx = dx / distance;
    let ny = dy / distance;

    let tx = -ny;
    let ty = nx;

    let dpTan1 = this.vx * tx + this.vy * ty;
    let dpTan2 = other.vx * tx + other.vy * ty;

    let dpNorm1 = this.vx * nx + this.vy * ny;
    let dpNorm2 = other.vx * nx + other.vy * ny;

    let m1 =
      (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) /
      (this.mass + other.mass);
    let m2 =
      (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) /
      (this.mass + other.mass);

    let overlap = this.r + other.r - distance;

    if (!this.fixed) {
      this.vx = tx * dpTan1 + nx * m1;
      this.vy = ty * dpTan1 + ny * m1;
      this.x += (nx * overlap) / 2;
      this.y += (ny * overlap) / 2;
    }
    if (!other.fixed) {
      other.vx = tx * dpTan2 + nx * m2;
      other.vy = ty * dpTan2 + ny * m2;
      other.x -= (nx * overlap) / 2;
      other.y -= (ny * overlap) / 2;
    }
  }

  collideWithWalls(width: number, height: number) {
    if (this.x - this.r < 0) {
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.r > width) {
      this.vx = -Math.abs(this.vx);
    }
    if (this.y - this.r < 0) {
      this.vy = Math.abs(this.vy);
    }
    if (this.y + this.r > height) {
      this.vy = -Math.abs(this.vy);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default Circle;
