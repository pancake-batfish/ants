var xoff = 0;
var yoff = 0;

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
  this.targetIndex=null;

  const ANTSTATE_FORAGING = "foraging";
  const ANTSTATE_SEEKING_FOOD = "seeking_food";
  const ANTSTATE_RETURNING = "returning";
  const ANTSTATE_INTERACTING = "interacting";
  const ANTSTATE_SEEKING_ANT = "seeking_ant";
  const ANTSTATE_EXITING = "exiting";

  var state = ANTSTATE_FORAGING;

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
    var wandering = this.wander();
    this.applyForce(wandering);

    if (state == ANTSTATE_FORAGING) {
        this.target = this.detectFood(this.supply);
        this.boundaryReverse();
    } else if (state == ANTSTATE_SEEKING_FOOD) {
        var foraging = this.arrive(this.target);
        this.applyForce(foraging);
        this.detectArrival();
        this.boundaryReverse();
    } else if (state == ANTSTATE_RETURNING) {
        var returning = this.arrive(this.nest.position);
        returning.mult(.1);
        this.applyForce(returning);
        if (this.crossingBoundary()) {
          state = ANTSTATE_INTERACTING;
        }
    } else if (state == ANTSTATE_INTERACTING) {
        this.target = this.detectAnt(this.colony);
        this.boundaryReverse();
    } else if (state == ANTSTATE_SEEKING_ANT)
        var interacting = this.arrive(this.target);
        interacting.mult(.1);
        this.applyForce(interacting);
        this.antennaTouch();
        this.boundaryReverse();
    } else if (state = ANTSTATE_EXITING) {
      var exiting = this.seek(this.nest.exit);
      if (this.crossingBoundary()) {
        state = ANTSTATE_FORAGING;
      }
    }
    this.update();
  };

  this.boundaryReverse = function() {
    // look at "stay within walls" steering behavior
      if (this.crossingBoundary()) {
        this.vel.mult(-1);
        // this.update();
      }
  }

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
    var angle = noise(xoff, yoff) * TWO_PI * 4;
    var noiseVector = p5.Vector.fromAngle(angle);
    noiseVector.setMag(0.1);

    xoff += this.inc;
    yoff += this.inc;

    return noiseVector;
    };

  this.crossingBoundary = function() {
    return (this.nest.insideNest(this.prevPos) != this.nest.insideNest(this.pos));
  };

  this.foodExpire = function() {
    var expireTime = 30000;
    if (!this.timeGotFood && this.hasFood) {
      this.timeGotFood = millis();
    }

    if (this.hasFood && this.timeGotFood && millis() > this.timeGotFood + expireTime) {
      this.hasFood = false;
      this.timeGotFood = null;
    }
  }

  this.detectFood = function() {
    var detectDistance = 20;
    var target = null;
    //iterate through supply
    for (var i = 0; i < supply.length; i++) {
      if (this.pos.dist(supply[i].pos) <= detectDistance) {
        state = ANTSTATE_SEEKING_FOOD;
        target = supply[i].pos;
      }
    }
    return target;
  };

  this.detectArrival = function() {
    for (var i = 0; i < supply.length; i++) {
      if (this.pos.dist(supply[i].pos) <= 1) {
        this.hasFood = true;
        supply.splice(i, 1);
        state = ANTSTATE_RETURNING;
      }
    }
  };

  //TODO: rewrite for new state-based design
  this.detectAnt = function(ants) {
    var detectDistance = 20;
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

  //TODO: rewrite for new state-based design
  // do I need to be clearing this.target?
  this.antennaTouch = function(targetAnt) {
    //detect arrival
    //check timer:
    // if not running, start - state = interacting
  }// if running, check:
      //  if under time limit, state = exiting
      //  if over time limit, clear timer, state = interacting

  }



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
