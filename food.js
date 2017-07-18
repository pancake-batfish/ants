function Food(x,y) {
  this.pos = createVector(x, y);

  this.run = function() {
    this.render();
  }

  this.render = function() {
    var green = color(133,158,75);
    stroke(green);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
  }
}
