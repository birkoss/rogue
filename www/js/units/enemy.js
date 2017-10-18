function Enemy(game, enemyID) {
	Unit.call(this, game, Unit.Type.Enemy, enemyID);

    this.fillRateATB = 25;

    this.target = null;
};

Enemy.prototype = Unit.prototype;
Enemy.prototype.constructor = Enemy;

Enemy.prototype.isActive = function() {
	return this.target != null;
};