var colony;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colony = new Colony();

  for (var i = 0; i < 1; i++) {
    var ant = new Ant(width/2, height/2);
    colony.addAnt(ant);
  }
  
}


function draw() {
  background(255);
  colony.run();



}
