function Food(x,y) {
  this.pos = createVector(x, y);
  this.available = true;

  this.run = function() {
    this.render();
  };

  this.render = function() {
    if (this.available) {
      var lightGreen = color(113, 193, 79);
      stroke(lightGreen);
      strokeWeight(5);
      point(this.pos.x, this.pos.y);
      strokeWeight(1);
    }
  };

}
