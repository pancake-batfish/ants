function Food(x,y) {
  this.pos = createVector(x, y);

  this.run = function() {
    this.render();
  }

  this.render = function() {
    var lightGreen = color(113, 193, 79);
    stroke(lightGreen);
    strokeWeight(5);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
  }
}
