function Tile(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.itemContainer = this.game.add.group();
    this.addChild(this.itemContainer);

    this.createBackground();
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
    let sprite = this.backgroundContainer.create(0, 0, "tile:dungeon");
    sprite.scale.setTo(GAME.config.scale);
    sprite.anchor.set(0.5, 0.5);

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
};

Tile.prototype.addEffect = function(effect) {
    let sprite = this.backgroundContainer.create(0, 0, "effect:" + effect);
    sprite.scale.setTo(GAME.config.scale);
    sprite.anchor.set(0.5, 0.5);

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
};

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

    sprite.isUsable = true;
    sprite.effects = [];

    switch (itemID) {
        case "potion":
            sprite.effects.push({'type':'health', 'amount':3});
            break;
        case "stair":
            sprite.effects.push({'type':'stair'});
            break;
    }

    sprite.x += sprite.width/2;
    sprite.y += sprite.height/2;
}

Tile.prototype.getItems = function() {
    let items = [];

    this.itemContainer.children.forEach(function(single_item) {
        if (single_item.isUsable) {
            items.push(single_item);
        }
    }, this);

    return items;
}