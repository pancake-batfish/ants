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

  this.atBoundary = function(location) {
    var margin = 1;
    return (location.dist(this.position) < this.radius + margin && location.dist(this.position) > this.radius - margin);
  }

  this.exit = function() {
    //this is not exactly right -- won't adapt to different nest rotations
    var x = this.radius * cos(this.rotation/2);
    var y = this.radius * sin(this.rotation/2);
    var exit = createVector(this.position.x + x + 50, this.position.y + y);

    return exit;
  }


}
