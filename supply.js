function Supply() {
  this.food = [];

  this.length = function() {
    return this.food.length;
  };

  this.run = function() {
    for (var i = 0; i < this.food.length; i++) {
      this.food[i].run();
    }
  };

  this.addFood = function(food) {
    this.food.push(food);
  };
}
