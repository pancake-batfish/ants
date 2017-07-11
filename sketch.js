var colony;
var nest;
var supply;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();
  supply = new Supply();
  nest = new Nest(100,height/6, 200, radians(45));

  //ants anywhere
  for (var i = 0; i < 13; i++) {
    var ant = new Ant(random(width), random(height), nest);
    colony.addAnt(ant);
  }
  //ants inside nest
  var j = 0;
  while (j < 7) {
    push();
    translate(nest.pos.x, nest.pos.y);
    var ant = new Ant(random(-nest.r, nest.r), random(-nest.r, nest.r), nest);
    pop();
    if (ant.insideNest(ant.pos)) {
      colony.addAnt(ant);
      j++;
    }
  }
  //distribution of food
  for (var i = 0; i < 15; i++) {
    var food = new Food(random(width), random(height));
    if (food.pos.dist(nest.pos) > (nest.r)) {
      supply.addFood(food);
    }
  }
}


function draw() {
  background(255);
  colony.run();
  supply.run();
  nest.render();


}
