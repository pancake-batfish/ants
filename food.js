function Food(x,y) {
  this.pos = createVector(x, y);
  this.available = true;

  // this.newUUID = function() {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // };

  // this.id = this.newUUID();

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
