import Circle from "./circle";
import Line from "./line";

class World {
  width: number;
  height: number;
  circles: Circle[] = [];
  lines: Line[] = [];

  wallCollisions: boolean = true;

  constructor(width, height, circles: Circle[] = []) {
    this.width = width;
    this.height = height;
    this.circles = circles;
  }

  setWallCollisions(wallCollisions: boolean) {
    this.wallCollisions = wallCollisions;
    return this;
  }

  energy() {
    let energy = 0;
    energy += this.lines.reduce((acc, line) => acc + line.energy(), 0);
    energy += this.circles.reduce((acc, circle) => acc + circle.energy(), 0);
    return energy;
  }

  addCircle(circle: Circle) {
    this.circles.push(circle);
  }

  addLine(line: Line) {
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

  update(dt: number) {
    this.checkCollisions();
    this.lines.forEach((line) => line.update(dt));
    this.circles.forEach((circle) => circle.update(dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.lines.forEach((line) => line.draw(ctx));
    this.circles.forEach((circle) => circle.draw(ctx));
  }
}

export default World;
