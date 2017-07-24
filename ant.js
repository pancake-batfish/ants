var xoff = 0;
var yoff = 0;

function Ant(x, y, nest, colony) {
  this.pos = createVector(x, y);
  this.vel = createVector(random(-1,1), random(-1,1));
  this.acc = createVector(0, 0);
  this.maxspeed = 1;
  this.maxforce = 0.2;
  this.d = 5;
  this.inc = 0.1;
  this.nest = nest;
  this.colony = colony;
  this.target = null;
  this.targetAnt = null;

  const ANTSTATE_FORAGING = "foraging";
  const ANTSTATE_SEEKING_FOOD = "seeking_food";
  const ANTSTATE_RETURNING = "returning";
  const ANTSTATE_INTERACTING = "interacting";
  const ANTSTATE_SEEKING_ANT = "seeking_ant";
  const ANTSTATE_EXITING = "exiting";

  this.state = ANTSTATE_FORAGING;
  this.hasFood = false;
  this.timeGotFood = null;
  this.timeSeekingAnt = null;
  this.timeCrossed = null;

  this.run = function() {
    this.coordinate();
    this.borders();
    this.foodExpire();
    this.render();
  };

  this.coordinate = function() {
    var inNest = this.nest.insideNest(this.pos);
    var wandering = this.wander();
    this.applyForce(wandering);

    if (this.state == ANTSTATE_FORAGING) {
        this.target = this.detectFood();
        this.boundaryReverse();
        if (inNest) {
          this.state = ANTSTATE_INTERACTING;
        }
    } else if (this.state == ANTSTATE_SEEKING_FOOD) {
        var foraging = this.seek(this.target.pos);
        this.applyForce(foraging);
        this.detectArrival();
        this.boundaryReverse();
    } else if (this.state == ANTSTATE_RETURNING) {
        var returning = this.arrive(this.nest.position);
        returning.mult(.1);
        this.applyForce(returning);
        if (inNest) {
          this.stateChangeAtBoundary(ANTSTATE_INTERACTING);
        }
    } else if (this.state == ANTSTATE_INTERACTING) {
        if (!this.hasFood) {
          this.targetAnt = this.detectAnt(this.colony);
        }
        this.boundaryReverse();
        if (!inNest) {
          this.state = ANTSTATE_FORAGING;
        }
    } else if (this.state == ANTSTATE_SEEKING_ANT) {
        var interacting = this.seek(this.targetAnt.pos);
        interacting.mult(.1);
        this.applyForce(interacting);
        this.arriveAnt(this.colony);
        this.boundaryReverse();
        this.seekingAntExpire();
        if (!inNest) {
          this.state = ANTSTATE_FORAGING;
        }
    } else if (this.state = ANTSTATE_EXITING) {
      var exiting = this.seek(this.nest.exit());
      this.applyForce(exiting);

      if (!inNest) {
        this.stateChangeAtBoundary(ANTSTATE_FORAGING);
      }
    }
    this.update();
  };

  this.boundaryReverse = function() {
      if (this.nest.atBoundary(this.pos)) {
        this.vel.mult(-1);
        this.update();
      }
  };

  this.stateChangeAtBoundary = function(newState) {
    if (!this.timeCrossed) {
      this.timeCrossed = millis();
    } else {
      var timeDelay = 200;
      if (millis() > this.timeCrossed + timeDelay) {
        this.state = newState;
        this.timeCrossed = null;
        if (this.hasFood) this.timeGotFood = millis();
      }
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

  this.debuggingColor = function() {
    var black = color(0, 0, 0, 150);
    var lightBlue = color(14, 143, 186, 150);
    var lightPurple = color(193, 151, 216, 150);
    var purple = color(103, 47, 198, 150);

    var redOrange = color(239, 82, 9, 150);
    var orange = color(239,155, 9, 150, 150);
    var yellow = color(237, 230, 30, 150);

    if (mode == DEBUG) {
      switch (this.state) {
        case ANTSTATE_FORAGING:
          return lightBlue;
        case ANTSTATE_SEEKING_FOOD:
          return lightPurple;
        case ANTSTATE_RETURNING:
          return purple;
        case ANTSTATE_INTERACTING:
          return redOrange;
        case ANTSTATE_SEEKING_ANT:
          return orange;
        case ANTSTATE_EXITING:
          return yellow;
      }
    } else {
      return black;
    }
  };

  this.render = function() {
    var antColor = this.debuggingColor();
    var theta = this.vel.heading();
    fill(antColor);
    stroke(antColor);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    ellipse(0, 0, this.d, this.d);
    ellipse(this.d, 0, this.d, this.d);
    if (this.hasFood) {
      var lightGreen = color(113, 193, 79);
      stroke(lightGreen);
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
  //
  //
  //
  // this.foodTimestamp = function() {
  //   if (!this.timeGotFood && this.hasFood) {
  //     this.timeGotFood = millis();
  //   }
  // }

  this.foodExpire = function() {
    var expireTime = 10000;
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
      if (this.pos.dist(supply[i].pos) <= detectDistance && supply[i].available) {
        this.state = ANTSTATE_SEEKING_FOOD;
        target = supply[i];
      }
    }
    return target;
  };

  this.detectArrival = function() {
    if (this.pos.dist(this.target.pos) <= 1) {
      if (this.target.available) {
        this.hasFood = true;
        this.target.available = false;
        this.state = ANTSTATE_RETURNING;
      } else {
        this.state = ANTSTATE_FORAGING;
      }
      this.target = null;
    }
  };

  this.detectAnt = function(ants) {
    var detectDistance = 20;
    var nearbyAnt = null;

    for (var i = 0; i < ants.length; i++) {
      if (this !== ants[i] && this.pos.dist(ants[i].pos) <= detectDistance) {
          nearbyAnt = ants[i];
          this.timeSeekingAnt = millis();
          this.state = ANTSTATE_SEEKING_ANT;
      }
    }
    return nearbyAnt;
  };

  this.seekingAntExpire = function() {
    var expireTime = 3000;
    if (millis() > this.timeSeekingAnt + expireTime) {
      this.state = ANTSTATE_INTERACTING;
    }
  }

  this.arriveAnt = function(ants) {
    var arriveDistance = 3;
    for (var i = 0; i < ants.length; i++) {
      if (this !== ants[i] && this.pos.dist(ants[i].pos) <= arriveDistance) {
        if (!this.hasFood && ants[i].hasFood) {
          this.state = ANTSTATE_EXITING;
        } else {
          this.state = ANTSTATE_INTERACTING;
        }
      }
    }
  };

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
