function Ant(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0,0);
  this.d = 5;

  this.run = function(ants) {
    //TODO: add function to apply forces
    this.update();
    // this.borders();
    this.render();
  };

  this.applyForce = function(force) {
    this.acc.add(f);
  };

  this.update = function() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
  };

  this.render = function() {
    fill(0, 150);
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.d, this.d);
    ellipse(this.d, 0, this.d, this.d);
    pop();
  };
}
