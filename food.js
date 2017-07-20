function Food(x,y) {
  this.pos = createVector(x, y);

  this.run = function() {
    this.render();
  }

  this.render = function() {
    var green = color(133,158,75);
    var red = color(255,0,0);
    stroke(red);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
  }
}
