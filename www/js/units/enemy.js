function Enemy(game) {
	Unit.call(this, game, Unit.Type.Enemy, 'skeleton');

    this.health = 2;
    this.fillRateATB = 25;
};

Enemy.prototype = Unit.prototype;
Enemy.prototype.constructor = Enemy;