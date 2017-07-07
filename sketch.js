var colony;
var nest;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();

  for (var i = 0; i < 1; i++) {
    var ant = new Ant(width/2, height/2);
    colony.addAnt(ant);
  }

  nest = new Nest(100,height/6, 200, radians(45));


}


function draw() {
  background(255);
  colony.run();
  nest.render();



}
