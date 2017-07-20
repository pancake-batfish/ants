var xoff = 0;
var yoff = 0;
// var startTime;

function Ant(x, y, nest, colony) {
  this.pos = createVector(x, y);
  this.prevPos = this.pos.copy();
  this.vel = createVector(random(-1,1), random(-1,1));
  this.acc = createVector(0, 0);
  this.maxspeed = 1;
  this.maxforce = 0.2;
  this.d = 5;
  this.inc = 0.1;
  this.nest = nest;
  this.colony = colony;
  this.target = null;

  // this.hasFood = true;
  this.hasFood = false;
  // var foodFactor = random(1);
  // if (foodFactor > .5) {
  //   this.hasFood = true;
  // }

  // this.timeGotFood = null;
  // this.exiting = false;

  // this.updatePrev = function() {
  //   this.prevPos.x = this.pos.x;
  //   this.prevPos.y = this.pos.y;
  // };

  this.run = function(ants) {
    this.coordinate();
    this.borders();
    // this.foodExpire();
    this.render();
    // this.updatePrev();
  };

  this.coordinate = function() {
    var inNest = this.nest.insideNest(this.pos);

    var wandering = this.wander();
    this.applyForce(wandering);

    if (!this.hasFood && !inNest) {
      this.target = this.detectFood(this.supply);
      if (this.target != null) {
        var foraging = this.arrive(this.target);
        this.applyForce(foraging);
      }
    } else if (this.hasFood && !inNest) {
        var returning = this.arrive(this.nest.position);
        returning.mult(.1);
        this.applyForce(returning);
    } else if (!this.hasFood && inNest) {
        this.target = this.detectAnt(this.colony);
        if (!this.hasFood && this.target != null) {
          var interacting = this.arrive(this.target);
          interacting.mult(.1);
          this.applyForce(interacting);
        }
    }


    this.update();
  //
  //   // look at "stay within walls" steering behavior
  //   if (this.crossingBoundary() && !this.hasFood && !this.exiting) {
  //     this.vel.mult(-1);
  //     this.update();
  //   }
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
      var green = color(93,186,65);
      var red = color(255,0,0);
      stroke(green);
      strokeWeight(5);
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
    noiseVector.setMag(0.1);

    xoff += this.inc;
    yoff += this.inc;

    return noiseVector;

    };

  // this.crossingBoundary = function() {
  //   return (this.nest.insideNest(this.prevPos) != this.nest.insideNest(this.pos));
  //
  // };

  // this.foodExpire = function() {
  //   var expireTime = 30000;
  //   if (!this.timeGotFood && this.hasFood) {
  //     this.timeGotFood = millis();
  //   }
  //
  //   if (this.hasFood && this.timeGotFood && millis() > this.timeGotFood + expireTime) {
  //     this.hasFood = false;
  //     this.timeGotFood = null;
  //   }
  // }

  this.detectFood = function() {
    var detectDistance = 20;
    var target = null;
    //iterate through supply
    for (var i = 0; i < supply.length; i++) {
      if (this.pos.dist(supply[i].pos) <= 1) {
        this.hasFood = true;
        supply.splice(i, 1);
        target = this.nest.position;
      } else if (this.pos.dist(supply[i].pos) > 1 && this.pos.dist(supply[i].pos) <= detectDistance && !this.hasFood) {
        target = supply[i].pos;
      }
    }
    return target;
  };

  this.detectAnt = function(ants) {
    var detectDistance = 200;
    var nearbyAnt = null;
    //iterate over array of ants
    for (var i = 0; i < ants.length; i++) {
      // if (this.pos.dist(ants[i].pos) <= 1) {
      //   target = this.antennaTouch(ants[i]);
      //   return target;
      // } else if (this.pos.dist(ants[i].pos) > 1 && this.pos.dist(ants[i].pos) <= detectDistance) {
      //   target = ants[i].pos;
      // }
      if (this.pos.dist(ants[i].pos) <= detectDistance) {
          nearbyAnt = ants[i].pos;
      }
    }
    return nearbyAnt;
  }

  // this.antennaTouch = function(targetAnt) {
  //   var timeLimit = 10000;
  //   if (!targetAnt.hasFood) {
  //     return null;
  //   } else {
  //     // this.exitNest();
  //     console.log("exiting");
  //     this.exiting = true;
  //     return this.nest.exit();
  //   }
    // } else if (targetAnt.hasFood && startTime > 0) {
    //   //start timer
    // } else if (targetAnt.hasFood && (millis() - startTime > timeLimit) {
    //   //exitNest
    //   //stop timer
    // }

  // }

  // this.exitNest = function() {
  //   console.log("exit nest!");
  // }

  //pursuit -- for moving target -- skate to where the puck will be
  this.arrive = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();

    if (d < 10) {
      var m = map(d, 0, 10, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    var steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxforce);
    return steering;
  };

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    var steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxforce);
    return steering;
  };

}
