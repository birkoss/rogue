function Player(game) {
	Unit.call(this, game, Unit.Type.Player, 'knight');

    this.fillRateATB = 20;

    this.hunger = this.maxHunger = 100;

    this.isHungry = new Phaser.Signal();
};

Player.prototype = Unit.prototype;
Player.prototype.constructor = Player;

Player.prototype.eat = function(amount) {
    this.hunger = Math.min(this.hunger + amount, this.maxHunger);
	this.isHungry.dispatch(this, amount);
}

Player.prototype.fatigue = function(amount) {
	this.hunger = Math.max(0, this.hunger - amount);
	this.isHungry.dispatch(this, -amount);
}

Player.isAlive = function() {
    return this.health > 0 && this.hunger > 0;
};