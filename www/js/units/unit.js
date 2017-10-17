function Unit(game, type, unitID) {

    Phaser.Group.call(this, game);

    this.type = type;

    this.data = GAME.json['units'][unitID];
    this.setHealth(this.data.health);

    this.spriteContainer = this.game.add.group();
    this.addChild(this.spriteContainer);

    this.sprite = this.spriteContainer.create(0, 0, 'tileset:units');
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.animations.add('idle', this.data.frames, 2, true);
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

Unit.Facing = {
    Left: 1,
    Right: -1
};

Unit.prototype.face = function(direction) {
    this.sprite.scale.x = direction;
};

Unit.prototype.isAlive = function() {
    return this.health > 0;
};

Unit.prototype.setHealth = function(newHealth) {
    this.health = this.maxHealth = newHealth;
}

/* Move a unit to a specified position: NXxNY */
Unit.prototype.move = function(nx, ny) {
    nx += this.width/2;
    ny += this.height/2;

    /* Face in the right direction */
    if (this.x < nx) {
        this.face(Unit.Facing.Right);
    } else if (this.x > nx) {
        this.face(Unit.Facing.Left);
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