var colony;
var supply = [];
const DEBUG = "debug";
const NORMAL = "normal";
var mode = DEBUG;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();
  colony.establish();
  var nest = colony.getNest();

  //distribution of food
  for (var i = 0; i < 15; i++) {
    var food = new Food(random(width), random(height));
    if (!nest.insideNest(food.pos)) {
      supply.push(food);
    }
  }
}

function keyPressed() {
  // if (value == "0") {
  if (keyCode == LEFT_ARROW) {
    mode = DEBUG;
  // } else if (value == "1") {
  } else if (keyCode == RIGHT_ARROW) {

    mode = NORMAL;
  }
}


function draw() {
  background(255);
  colony.run();
  for (var i = 0; i < supply.length; i++) {
    supply[i].render();
  }
}
