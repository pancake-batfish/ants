function Nest(xPosition, yPosition, diameter, rotation) {
  this.position = createVector(xPosition, yPosition);
  this.diameter = diameter;
  this.radius = diameter/2;
  this.rotation = rotation;

  this.render = function() {
    noFill();
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);
    arc(0, 0, this.diameter, this.diameter, 0, radians(315), OPEN);
    pop();
  };
  
this.locationInNest = function() {
    var variationX = random(-this.radius, this.radius);
    var variationY = random(-this.radius, this.radius);
    var newLocation = this.position.copy();
    newLocation.x += variationX;
    newLocation.y += variationY;
    return newLocation;
}

  this.insideNest = function(location) {
    return (location.dist(this.position) < this.radius);
  };


}
