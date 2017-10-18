function Effect(game, x, y, type) {
    let spriteSheet = "tileset:effectsLarge"
    switch (type) {
        case "attack":
            spriteSheet = "tileset:effectsLarge";
            break;
    }

    Phaser.Sprite.call(this, game, x, y, spriteSheet);
    this.anchor.set(0.5, 0.5);

    switch (type) {
        case "attack":
            this.animations.add('idle', [10, 11, 10, 11, 10], 8, false);
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