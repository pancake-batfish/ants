function Nest(xPosition, yPosition, diameter, rotation) {
  this.pos = createVector(xPosition, yPosition);
  this.diameter = diameter;
  this.radius = diameter/2;
  this.rotation = rotation;

  this.render = function() {
    noFill();
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    arc(0, 0, this.diameter, this.diameter, 0, radians(315), OPEN);
    pop();
  }
}
