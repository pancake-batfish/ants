function Colony() {
  var nest;
  this.ants = [];

  this.establish = function() {
    //create nest
    // var nestPosition = createVector(100, height/6);
    var nestPosition = createVector(width/2, height/2);
    var nestDiameter = 200;
    var nestRotation = 45;
    nest = new Nest(nestPosition.x, nestPosition.y, nestDiameter, radians(nestRotation));

    //ants anywhere
    // for (var i = 0; i < 15; i++) {
    //   var ant = new Ant(random(width), random(height), nest);
    //   this.ants.push(ant);
    // }

    //ants in nest
    // push();
    // translate(nest.position.x, nest.position.y);
    for (var i = 0; i < 7; i++) {
      var randomLocation = nest.locationInNest();
      // console.log("colony:" + randomLocation.x);
      var ant = new Ant(randomLocation.x, randomLocation.y, nest);
      this.ants.push(ant);
    }
    // pop();
  };

  this.run = function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].run(this.ants);
    }
    nest.render();
  };

  // this.addAnt = function(ant) {
  //   this.ants.push(ant);
  // }
}
