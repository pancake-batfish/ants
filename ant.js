var xoff = 0;
var yoff = 0;

function Ant(x, y, nest) {
  this.pos = createVector(x, y);
  this.prevPos = this.pos.copy();
  this.vel = createVector(0, 0);
  this.acc = createVector(0,0);
  this.maxspeed = 1;
  this.maxforce = 0.2;
  this.d = 5;
  this.inc = 0.1;

  this.nestPos = createVector(nest.pos.x, nest.pos.y);
  this.nestRadius = nest.d / 2;

  this.hasFood = false;
  this.timeGotFood = null;

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  this.run = function(ants) {
    this.coordinate();
    this.borders();
    this.foodExpire();
    this.render();
    this.updatePrev();
  };

  this.coordinate = function() {
    if (!this.hasFood && !this.insideNest(this.pos)) {
      var wandering = this.wander();
      this.applyForce(wandering);

      var target = this.detectFood(this.supply);
      if (target != null) {
        var foraging = this.seek(target);
        this.applyForce(foraging);
      } else {
        var wandering = this.wander();
        this.applyForce(wandering);
      }
    } else if (this.hasFood && !this.insideNest(this.pos)) {
        var returning = this.seek(this.nestPos);
        this.applyForce(returning);
    } else {
      var wandering = this.wander();
      this.applyForce(wandering);
    }

    this.update();

    if (this.crossingBoundary() && !this.hasFood) {
      this.vel.mult(-1);
      this.update();
    }
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
    if (this.hasFood) {
      stroke(133, 158, 75);
      strokeWeight(4);
      point(this.d/2, 0);
      strokeWeight(1);
    }
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

    return noiseVector;
  };

  this.insideNest = function(position) {
    return (position.dist(this.nestPos) < (this.nestRadius));
  };

  this.crossingBoundary = function() {
    //need to store previous position and compare
    //if new position represents a change from inside to outside
    //need to revise position or velocity to stay on current side
    return (this.insideNest(this.prevPos) != this.insideNest(this.pos));
  };

  this.foodExpire = function() {
    var expireTime = 30000;
    if (!this.timeGotFood && this.hasFood) {
      this.timeGotFood = millis();
      console.log(this.timeGotFood);
    }

    if (this.hasFood && this.timeGotFood && millis() > this.timeGotFood + expireTime) {
      console.log("expired");
      this.hasFood = false;
      this.timeGotFood = null;
    }
  }



  this.detectFood = function() {
    var detectDistance = 20;
    var target = null;
    //iterate through supply
    for (var i = 0; i < supply.length; i++) {
      if (this.pos.dist(supply[i].pos) <= 1) {
        this.hasFood = true;
        supply.splice(i, 1);
        return target;
      } else if (this.pos.dist(supply[i].pos) > 1 && this.pos.dist(supply[i].pos) <= detectDistance && !this.hasFood) {
        target = supply[i].pos;
      }
    }
    return target;
  };

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  };
}
