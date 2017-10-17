function Player(game) {
	Unit.call(this, game, Unit.Type.Player, 'knight');

    this.health = 20;
    this.fillRateATB = 20;
};

Player.prototype = Unit.prototype;
Player.prototype.constructor = Player;