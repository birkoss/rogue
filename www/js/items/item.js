function Item(game, itemID) {
    Phaser.Group.call(this, game);

    this.data = GAME.json['items'][itemID];

    this.spriteContainer = this.game.add.group();
    this.addChild(this.spriteContainer);

    this.sprite = this.spriteContainer.create(0, 0, 'tileset:items');
    this.sprite.anchor.set(0.5, 0.5);
    console.log(this.data);
    this.sprite.frame = this.data.frame;
};

Item.prototype = Object.create(Phaser.Group.prototype);
Item.prototype.constructor = Unit;