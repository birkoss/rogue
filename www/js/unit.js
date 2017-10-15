function Unit(game) {
    Phaser.Group.call(this, game);

    this.spriteContainer = this.game.add.group();
    this.addChild(this.spriteContainer);

    let sprite = this.spriteContainer.create(0, 0, 'unit:skeleton');
    sprite.scale.setTo(GAME.config.scale);
    sprite.anchor.set(0.5, 0.5);

    sprite.animations.add('idle', [0, 1], 2, true);
    sprite.animations.play('idle');

    this.health = 1;

    this.isReady = new Phaser.Signal();
    this.hasMoved = new Phaser.Signal();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.setPosition = function(newX, newY) {
    this.x = newX + 24;
    this.y = newY + 24;

    this.gridX = newX;
    this.gridY = newY;
}

Unit.prototype.move = function(gridX, gridY) {
    let nx = (this.gridX * 48) + 24;
    let ny = (this.gridY * 48) + 24;

    /* Face in the right direction */
    if (this.x < nx) {
        this.scale.x = -1;
    } else if (this.x > nx) {
        this.scale.x = 1;
    }

    let tween = this.game.add.tween(this).to({x:nx, y:ny}, 100);
    tween.onComplete.add(function() {
        this.hasMoved.dispatch(this);
    }, this);
    tween.start();
}

Unit.prototype.isAlive = function() {
    return this.health > 0;
}

Unit.prototype.takeDamage = function(damage) {
    this.health = Math.max(this.health-damage, 0);
};

Unit.prototype.damage = function(nbrDamage) {
    let startingHealth = this.health;
    this.health = Math.max(this.health-nbrDamage, 0);

    this.updateHealth(startingHealth, this.health);

    let sprite = this.spriteContainer.create(0, 0, 'effect:attack');
    sprite.scale.setTo(GAME.config.scale);
    sprite.anchor.set(0.5, 0.5);

    let animation = sprite.animations.add('idle', [0, 1, 0, 1, 0, 1], 10, false);
    sprite.animations.play('idle');

    animation.onComplete.add(function(animation) {
        animation.destroy();
        this.isReady.dispatch(this);
    }, this);
}

Unit.prototype.updateHealth = function(from, to) {
    for (let i=from-1; i>to-1; i--) {
        let index = Math.floor(i / 2);
        this.healthContainer.getChildAt(index).frame = Math.min(2, this.healthContainer.getChildAt(index).frame+1);
        
        let sprite = this.healthContainer.create(0, 0, 'effect:health');
        sprite.anchor.set(0.5, 0.5);
        sprite.x = this.healthContainer.getChildAt(index).x;
        sprite.y = this.healthContainer.getChildAt(index).y;
        sprite.x += sprite.width/2;
        sprite.y += sprite.height/2;

        let tween = this.game.add.tween(sprite.scale).to({x:3, y:3}, 600);
        let tween2 = this.game.add.tween(sprite).to({alpha: 0}, 800).start();
        tween.start();
    }
}