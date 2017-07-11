var colony;
var nest;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();
  nest = new Nest(100,height/6, 200, radians(45));

  for (var i = 0; i < 13; i++) {
    var ant = new Ant(nest);
    colony.addAnt(ant);
  }
  // frameRate(10);
}


function draw() {
  background(255);
  colony.run();
  nest.render();

}
