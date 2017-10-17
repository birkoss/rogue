function Enemy(game) {
	Unit.call(this, game, Unit.Type.Enemy, 'skeleton');

    this.health = 2;
    this.fillRateATB = 25;

    this.target = null;
};

Enemy.prototype = Unit.prototype;
Enemy.prototype.constructor = Enemy;

Enemy.prototype.isActive = function() {
	return this.target != null;
};