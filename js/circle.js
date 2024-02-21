class Circle {
    constructor(x = 0, y = 0, r = 1) {
        this.mass = 1;
        this.vx = 0;
        this.vy = 0;
        this.x = x;
        this.y = y;
        this.r = r;
    }
    copy() {
        return new Circle(this.x, this.y, this.r)
            .setVelocity(this.vx, this.vy)
            .setMass(this.mass);
    }
    setMass(mass) {
        this.mass = mass;
        return this;
    }
    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
        return this;
    }
    energy() {
        return 0.5 * this.mass * (this.vx * this.vx + this.vy * this.vy);
    }
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        return this;
    }
    collidesWith(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.r + other.r;
    }
    collide(other) {
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
        let m1 = (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) /
            (this.mass + other.mass);
        let m2 = (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) /
            (this.mass + other.mass);
        this.vx = tx * dpTan1 + nx * m1;
        this.vy = ty * dpTan1 + ny * m1;
        other.vx = tx * dpTan2 + nx * m2;
        other.vy = ty * dpTan2 + ny * m2;
        let overlap = this.r + other.r - distance;
        this.x += (nx * overlap) / 2;
        this.y += (ny * overlap) / 2;
        other.x -= (nx * overlap) / 2;
        other.y -= (ny * overlap) / 2;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.stroke();
    }
}
export default Circle;
