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
  if (keyCode == LEFT_ARROW) {
    mode = DEBUG;
  } else if (keyCode == RIGHT_ARROW) {
    mode = NORMAL;
  }
}
