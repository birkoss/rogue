function Player(game) {
	Unit.call(this, game, Unit.Type.Player, 'knight');

    this.fillRateATB = 20;

    this.hunger = this.maxHunger = 100;
};

Player.prototype = Unit.prototype;
Player.prototype.constructor = Player;

Player.prototype.eat = function(amount) {
    this.hunger += amount;
    this.maxHunger += amount;
}
