function Player(game) {
	Unit.call(this, game, Unit.Type.Player, 'knight');

    this.fillRateATB = 20;

    this.hunger = this.maxHunger = 100;

    this.isHungry = new Phaser.Signal();
};

Player.prototype = Unit.prototype;
Player.prototype.constructor = Player;

Player.prototype.eat = function(amount) {
    this.hunger += amount;
    this.maxHunger += amount;
}

Player.prototype.fatigue = function(amount) {
	this.hunger = Math.max(0, this.hunger - amount);

	this.isHungry.dispatch(this. amount);
}