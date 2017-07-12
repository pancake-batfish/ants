function Nest(x, y, d, theta) {
  this.pos = createVector(x, y);
  this.d = d;
  this.r = d/2;
  this.theta = theta;

  this.render = function() {
    noFill();
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.theta);
    arc(0, 0, this.d, this.d, 0, radians(315), OPEN);
    pop();
  }
}
