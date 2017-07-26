var colony;
var supply = [];
const DEBUG = "debug";
const NORMAL = "normal";
var mode = NORMAL;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();
  colony.establish();
  var foodCount = 20;
  distributeFood(foodCount);
}

function draw() {
  background(255);
  colony.run();
  for (var i = 0; i < supply.length; i++) {
    supply[i].render();
  }
}

function distributeFood(count) {
  for (var i = 0; i < count; i++) {
    addFood(random(width), random(height));
  }
}

function addFood(x, y) {
  var nest = colony.getNest();
  var food = new Food(x, y);
  if (!nest.insideNest(food.pos)) {
    supply.push(food);
  }
}

function mousePressed() {
  addFood(mouseX, mouseY);
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    colony.addAnt();
  } else if (keyCode == DOWN_ARROW) {
    colony.removeAnt();
  } else if (keyCode == 32) {
    distributeFood(10); //spacebar to scatter food
  } else if (keyCode == 68) {
    mode = DEBUG; //press D for debug
  } else if (keyCode == 78) {
    mode = NORMAL; //press N for normal
  }
  return false; //prevents browser defaults
}

function deviceShaken() {
    mode = DEBUG;
}
