class World {
    constructor(width, height, circles = []) {
        this.circles = [];
        this.width = width;
        this.height = height;
        this.circles = circles;
    }
    energy() {
        let energy = 0;
        for (let i = 0; i < this.circles.length; i++) {
            energy += this.circles[i].energy();
        }
        return energy;
    }
    addCircle(circle) {
        this.circles.push(circle);
    }
    checkCollisions() {
        for (let i = 0; i < this.circles.length; i++) {
            // Other Circles
            for (let j = i + 1; j < this.circles.length; j++) {
                if (this.circles[i].collidesWith(this.circles[j])) {
                    this.circles[i].collide(this.circles[j]);
                }
            }
            // Walls
            if (this.circles[i].x - this.circles[i].r < 0) {
                this.circles[i].vx = Math.abs(this.circles[i].vx);
            }
            if (this.circles[i].x + this.circles[i].r > this.width) {
                this.circles[i].vx = -Math.abs(this.circles[i].vx);
            }
            if (this.circles[i].y - this.circles[i].r < 0) {
                this.circles[i].vy = Math.abs(this.circles[i].vy);
            }
            if (this.circles[i].y + this.circles[i].r > this.height) {
                this.circles[i].vy = -Math.abs(this.circles[i].vy);
            }
        }
    }
    update(dt) {
        this.checkCollisions();
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i].update(dt);
        }
    }
    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i].draw(ctx);
        }
    }
}
export default World;
