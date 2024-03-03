class World {
    constructor(width, height, circles = []) {
        this.circles = [];
        this.lines = [];
        this.wallCollisions = true;
        this.width = width;
        this.height = height;
        this.circles = circles;
    }
    setWallCollisions(wallCollisions) {
        this.wallCollisions = wallCollisions;
        return this;
    }
    energy() {
        let energy = 0;
        energy += this.lines.reduce((acc, line) => acc + line.energy(), 0);
        energy += this.circles.reduce((acc, circle) => acc + circle.energy(), 0);
        return energy;
    }
    addCircle(circle) {
        this.circles.push(circle);
    }
    addLine(line) {
        this.lines.push(line);
    }
    checkCollisions() {
        for (let i = 0; i < this.circles.length; i++) {
            for (let j = i + 1; j < this.circles.length; j++) {
                this.circles[i].collideWithCircle(this.circles[j]);
            }
        }
        this.lines.forEach((line) => {
            this.circles.forEach((circle) => line.collideWithCircle(circle));
            this.wallCollisions && line.collideWithWalls(this.width, this.height);
        });
        this.circles.forEach((circle) => {
            this.wallCollisions && circle.collideWithWalls(this.width, this.height);
        });
    }
    update(dt) {
        this.checkCollisions();
        this.lines.forEach((line) => line.update(dt));
        this.circles.forEach((circle) => circle.update(dt));
    }
    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        this.lines.forEach((line) => line.draw(ctx));
        this.circles.forEach((circle) => circle.draw(ctx));
    }
}
export default World;
