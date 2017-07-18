var colony;
var nest;
var supply = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();
  var nestPosition = createVector(100, height/6);
  var nestDiameter = 200;
  var nestRotation = 45;
  nest = new Nest(nestPosition.x, nestPosition.y, nestDiameter, radians(nestRotation));

  //distribution of food
  for (var i = 0; i < 15; i++) {
    var food = new Food(random(width), random(height));
    if (food.pos.dist(nest.pos) > (nest.radius)) {
      supply.push(food);
    }
  }
  //ants anywhere
  for (var i = 0; i < 15; i++) {
    var ant = new Ant(random(width), random(height), nest);
    colony.addAnt(ant);
  }
  //ants inside nest
  var j = 0;
  while (j < 7) {
    push();
    translate(nest.pos.x, nest.pos.y);
    var ant = new Ant(random(-nest.radius, nest.radius), random(-nest.radius, nest.radius), nest);
    pop();
    if (ant.insideNest(ant.pos)) {
      colony.addAnt(ant);
      j++;
    }
  }
}


function draw() {
  background(255);
  colony.run();
  nest.render();
  for (var i = 0; i < supply.length; i++) {
    supply[i].render();
  }


}
