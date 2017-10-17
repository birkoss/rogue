function Enemy(game) {
	Unit.call(this, game, Unit.Type.Enemy, 'rat');

    this.fillRateATB = 25;

    this.target = null;
};

Enemy.prototype = Unit.prototype;
Enemy.prototype.constructor = Enemy;

Enemy.prototype.isActive = function() {
	return this.target != null;
};