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
    push();
    translate(this.position.x, this.position.y);
    var theta = random(0, 360);
    var newLocation = p5.Vector.fromAngle(radians(theta));
    var distance = floor(random(0, this.radius));
    // console.log(distance);
    newLocation.setMag(distance);
    // console.log("nest:" + newLocation.x);
    pop();
    return newLocation;
  };

  this.insideNest = function(location) {
    return (location.dist(this.position) < this.radius);
  };


}
