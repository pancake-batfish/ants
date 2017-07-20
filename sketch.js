var colony;
var supply = [];

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


function draw() {
  background(255);
  colony.run();
  // for (var i = 0; i < supply.length; i++) {
  //   supply[i].render();
  // }
}
