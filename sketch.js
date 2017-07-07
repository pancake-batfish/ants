var vehicle;

function setup() {
  createCanvas(640, 360);
  vehicle = new Vehicle(320, 180);
}


function draw() {
  background(51);

  vehicle.update();
  // vehicle.checkEdges();
  vehicle.display();

}
