function Tile(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.itemContainer = this.game.add.group();
    this.addChild(this.itemContainer);

    this.fowContainer = this.game.add.group();
    this.addChild(this.fowContainer);

    this.createBackground();

    this.createFow();

    this.onReveal = new Phaser.Signal();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.setType = function(newType) {
    this.type = newType;
    this.setFrame(0);
}

Tile.prototype.setFrame = function(newFrame) {
    this.frame = newFrame;
}

Tile.prototype.createBackground = function() {
    let sprite = this.backgroundContainer.create(0, 0, "tile:grass");
    sprite.scale.setTo(GAME.config.scale);
    sprite.anchor.set(0.5, 0.5);

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
};

Tile.prototype.createFow = function() {
    let sprite = this.fowContainer.create(0, 0, "tile:blank");
    sprite.tint = 0x2b2b2b;
    sprite.width = sprite.height = GAME.config.spriteSize * GAME.config.scale;
    sprite.anchor.set(0.5, 0.5);

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
};

Tile.prototype.reveal = function(fading = false) {
    //let tween = this.game.add.tween(this.fowContainer.getChildAt(0)).to({alpha:0}, 500);
    //tween.start();
    if (!this.isRevealed()) {
        let sprite = this.fowContainer.getChildAt(0);
        if (fading) {
            if (sprite.alpha == 1) {
                this.game.add.tween(this.fowContainer.getChildAt(0)).to({alpha:0.5}, 500).start();
            }
        } else {
            let tween = this.game.add.tween(this.fowContainer.getChildAt(0)).to({alpha:0}, 150);
            tween.onComplete.add(function() {
                this.onReveal.dispatch(this);
                this.fowContainer.removeAll(true);
            }, this);
            tween.start();
        }
    }
}

Tile.prototype.isRevealed = function() {
    return (this.fowContainer.children.length == 0);
}

Tile.prototype.addSprite = function(spriteName) {
    console.log(spriteName);
    this.addChild(this.createTile(spriteName));
};

Tile.prototype.createTile = function(spriteName, frame) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    //tile.scale.set(3);
    tile.anchor.set(0.5, 0.5);

    if (frame != null) {
        tile.frame = frame;
    }

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    return tile;
};

Tile.prototype.addDecor = function() {
    this.decor = this.createTile("tile:detail", 0);
    this.addChild(this.decor);
};

Tile.prototype.setItem = function(spriteName, frame, isEditable) {
    this.isEditable = (isEditable ? true : false);

    this.item = this.createTile(spriteName, 0);
    this.addChild(this.item);
};

Tile.prototype.addItem = function(itemID) {
    let sprite = this.itemContainer.create(0, 0, "item:" + itemID);
    sprite.width = sprite.height = GAME.config.spriteSize * GAME.config.scale;
    sprite.anchor.set(0.5, 0.5);

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
}