function Effect(game, x, y, type) {
    let spriteSheet = "effect:attack"
    switch (type) {
        case "attack":
            spriteSheet = "effect:attack";
            break;
    }

    Phaser.Sprite.call(this, game, x, y, spriteSheet);
    this.anchor.set(0.5, 0.5);

    switch (type) {
        case "attack":
            this.animations.add('idle', [0, 1, 0, 1, 0], 8, false);
            break;
    }
    this.animations.play('idle');

    this.animations.currentAnim.onComplete.add(function() {
        this.onEffectComplete.dispatch();
        this.destroy();
    }, this);

    this.onEffectComplete = new Phaser.Signal();
};

Effect.prototype = Object.create(Phaser.Sprite.prototype);
Effect.prototype.constructor = Effect;