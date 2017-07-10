function Ant(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0.8, 0.8);
  this.acc = createVector(0,0);
  this.maxspeed = 1;
  this.maxforce = 0.2;
  this.d = 5;
  this.t = 0;

  this.run = function(ants) {
    //TODO: add function to apply forces
    this.update();
    this.borders();
    this.render();
  };

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
      // var wandering = this.wander();
      // this.applyForce(wandering);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
  };

  this.render = function() {
    var theta = this.vel.heading();
    fill(0, 150);
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    ellipse(0, 0, this.d, this.d);
    ellipse(this.d, 0, this.d, this.d);
    pop();
  };

  this.borders = function() {
  if (this.pos.x < -this.d) this.pos.x = width + this.d;
  if (this.pos.y < -this.d) this.pos.y = height + this.d;
  if (this.pos.x > width + this.d) this.pos.x = -this.d;
  if (this.pos.y > height + this.d) this.pos.y = -this.d;
};

  this.wander = function() {
    //use noise to set a new direction
    //different from but related to current direction

    var x = noise(this.t);
    var y = noise(this.t);
    this.t += .01;
    var noiseVector = createVector(x,y); //will generate with noise
    var desired = p5.Vector.add(noiseVector, this.pos);
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  };
}
