function Food(x,y) {
  this.pos = createVector(x, y);

  this.run = function() {
    this.render();
  }

  this.render = function() {
    var green = color(93,186,65);
    var red = color(255,0,0);
    stroke(green);
    strokeWeight(5);
    point(this.pos.x, this.pos.y);
    strokeWeight(1);
  }
}
