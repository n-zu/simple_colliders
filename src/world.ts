import Circle from "./circle";

class World {
  width: number;
  height: number;
  circles: Circle[] = [];

  constructor(width, height, circles: Circle[] = []) {
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

  addCircle(circle: Circle) {
    this.circles.push(circle);
  }

  checkCollisions() {
    for (let i = 0; i < this.circles.length; i++) {
      for (let j = i + 1; j < this.circles.length; j++) {
        this.circles[i].collideWithCircle(this.circles[j]);
      }
    }
    this.circles.forEach((circle) =>
      circle.collideWithWalls(this.width, this.height)
    );
  }

  update(dt: number) {
    this.checkCollisions();
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].draw(ctx);
    }
  }
}

export default World;
