function Unit(game, type, spriteName) {

    Phaser.Group.call(this, game);

    this.type = type;

    this.spriteContainer = this.game.add.group();
    this.addChild(this.spriteContainer);

    this.sprite = this.spriteContainer.create(0, 0, 'unit:' + spriteName);
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.animations.add('idle', [0, 1], 2, true);
    this.sprite.animations.play('idle');

    this.hasMoved = new Phaser.Signal();

    this.clearATB();
};


Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.Type = {
    Player: 1,
    Enemy: 2
};

Unit.prototype.isAlive = function() {
    return this.health > 0;
};

/* Move a unit to a specified position: NXxNY */
Unit.prototype.move = function(nx, ny) {
    nx += this.width/2;
    ny += this.height/2;

    /* Face in the right direction */
    if (this.x < nx) {
        this.sprite.scale.x = -1;
    } else if (this.x > nx) {
        this.sprite.scale.x = 1;
    }

    let tween = this.game.add.tween(this).to({x:nx, y:ny}, 300, Phaser.Easing.Quadratic.Out);
    tween.onComplete.add(function() {
        this.hasMoved.dispatch(this);
    }, this);
    tween.start();
};

Unit.prototype.takeDamage = function(damage) {
    this.health = Math.max(this.health-damage, 0);

    if (!this.isAlive()) {
        this.spriteContainer.removeAll(true);
        let sprite = this.spriteContainer.create(0, 0, 'effect:blood');
        sprite.anchor.set(0.5, 0.5);
    }
};

/* ATB */

Unit.prototype.clearATB = function() {
    this.ATB = 0;
};

Unit.prototype.getMaxATB = function() {
    return 100;
};

Unit.prototype.getFillRateATB = function() {
    return this.fillRateATB;
};

Unit.prototype.isReady = function() {
    return (this.ATB >= this.getMaxATB());
};

Unit.prototype.updateATB = function() {
    this.ATB = Math.min(this.ATB + this.getFillRateATB(), this.getMaxATB());
};