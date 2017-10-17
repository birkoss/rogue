function Unit(game, type) {
    Phaser.Group.call(this, game);

    this.type = type;
    this.spriteContainer = this.game.add.group();
    this.addChild(this.spriteContainer);

    let spriteName = (this.type === Unit.Type.AI ? 'skeleton' : 'knight');
    this.sprite = this.spriteContainer.create(0, 0, 'unit:' + spriteName);
    this.sprite.anchor.set(0.5, 0.5);

    this.sprite.animations.add('idle', [0, 1], 2, true);
    this.sprite.animations.play('idle');

    if (this.type == Unit.Type.AI) {
        this.health = 2;
        this.fillRateATB = 6;
    } else {
        this.health = 20;
        this.fillRateATB = 5;
    }

    this.hasMoved = new Phaser.Signal();

    this.clearATB();
};


Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.Type = {
    Player: 1,
    AI: 2
};

Unit.prototype.setPosition = function(newX, newY) {
    this.x = newX + 24;
    this.y = newY + 24;

    this.gridX = newX;
    this.gridY = newY;
}

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
}

Unit.prototype.isAlive = function() {
    return this.health > 0;
}

Unit.prototype.takeDamage = function(damage) {
    this.health = Math.max(this.health-damage, 0);
    if (!this.isAlive()) {
        this.spriteContainer.removeAll(true);
        let sprite = this.spriteContainer.create(0, 0, 'effect:blood');
        sprite.anchor.set(0.5, 0.5);
    }
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
    }, this);
};

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