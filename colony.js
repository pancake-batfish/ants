function Colony() {
  var nest;
  this.ants = [];

  this.establish = function() {
    //create nest
    var nestDiameter = 200;
    var nestRotation = 45;
    var nestPosition = createVector(nestDiameter/2 + 50, height/6);

    nest = new Nest(nestPosition.x, nestPosition.y, nestDiameter, radians(nestRotation));

    // ants anywhere
    for (var i = 0; i < 20; i++) {
      var ant = new Ant(random(width), random(height), nest, this.ants);
      this.ants.push(ant);
    }

    // //ants in nest
    // for (var i = 0; i < 7; i++) {
    //   var randomLocation = nest.locationInNest();
    //   var ant = new Ant(randomLocation.x, randomLocation.y, nest, this.ants);
    //   this.ants.push(ant);
    // }
  };

  this.run = function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].run(this.ants);
    }
    nest.render();
  };

  this.getNest = function() {
    return nest;
  }

}
