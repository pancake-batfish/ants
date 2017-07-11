function Colony() {
  this.ants = [];

  this.run = function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].run(this.ants);
    }
  };

  this.addAnt = function(ant) {
    this.ants.push(ant);
  }
}
