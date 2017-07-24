function Colony() {
  var nest;
  this.ants = [];

  this.establish = function() {
    var nestDiameter = 200;
    var nestRotation = 45;
    var nestPosition = createVector(nestDiameter/2 + 50, height/6);

    nest = new Nest(nestPosition.x, nestPosition.y, nestDiameter, radians(nestRotation));

    var antCount = 20;
    for (var i = 0; i < antCount; i++) {
      this.addAnt();
    }
  };

  this.addAnt = function() {
    var ant = new Ant (random(width), random(height), nest, this.ants);
    this.ants.push(ant);
  };

  this.removeAnt = function() {
    this.ants.splice(0, 1);
  };

  this.run = function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].run();
    }
    nest.render();
  };

  this.getNest = function() {
    return nest;
  }

}
