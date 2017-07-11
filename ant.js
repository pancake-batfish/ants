var xoff = 0;
var yoff = 0;

function Ant(nest) {
  this.pos = createVector(random(width), random(height));

  this.vel = createVector(0, 0);
  this.acc = createVector(0,0);
  this.maxspeed = 1;
  this.maxforce = 0.2;
  this.d = 5;
  this.inc = 0.1;
  this.nestPos = createVector(nest.pos.x, nest.pos.y);
  this.nestRadius = nest.d / 2;

  this.prevPos = this.pos.copy();
  // this.prevPos.x += this.d;
  // this.prevPos.y += this.d;
  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.run = function(ants) {
    var wandering = this.wander();
    this.applyForce(wandering);

    this.update();
    this.nestBoundary();
    this.borders();

    this.render();
    this.updatePrev();

  };

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
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
    var angle = noise(xoff, yoff) * TWO_PI * 4;
    var noiseVector = p5.Vector.fromAngle(angle);
    noiseVector.setMag(0.05);


    xoff += this.inc;
    yoff += this.inc;
    // var desired = p5.Vector.add(noiseVector, this.pos);
    // desired.setMag(this.maxspeed);
    // var steer = p5.Vector.sub(desired, this.vel);
    // steer.limit(this.maxforce);
    return noiseVector;
  };

  this.insideNest = function(position) {
    return (position.dist(this.nestPos) < this.nestRadius)
  }

  this.nestBoundary = function() {
    //need to store previous position and compare
    //if new position represents a change from inside to outside
    //need to revise position or velocity to stay on current side
    if (this.insideNest(this.prevPos) != this.insideNest(this.pos)) {
      this.vel.mult(-1);
    }

  }


}
