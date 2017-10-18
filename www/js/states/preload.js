var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype.preload = function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
    this.preloadBar.anchor.set(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level:1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('tileset:world', 'assets/images/tilesets/world.png');
    this.load.spritesheet('tileset:items', 'assets/images/tilesets/items.png', 32, 32);
    this.load.spritesheet('tileset:units', 'assets/images/tilesets/units.png', 48, 48);

    this.load.image('helper:move', 'assets/images/helpers/move.png');
    this.load.image('helper:back', 'assets/images/helpers/back.png');
    this.load.image('helper:attack', 'assets/images/helpers/attack.png');

    this.load.spritesheet('effect:attack', 'assets/images/effects/attack.png', 64, 64);
    this.load.spritesheet('effect:blood', 'assets/images/effects/blood.png', 48, 48);

    this.load.spritesheet('unit:knight', 'assets/images/units/knight.png', 48, 48);
    this.load.spritesheet('unit:skeleton', 'assets/images/units/skeleton.png', 48, 48);

    this.load.bitmapFont('font:guiOutline', 'assets/fonts/guiOutline.png', 'assets/fonts/guiOutline.xml');
    this.load.bitmapFont('font:gui', 'assets/fonts/gui.png', 'assets/fonts/gui.xml');

    this.load.spritesheet('gui:button', 'assets/images/button.png', 100, 32);

    this.load.json("data:units", "assets/data/units.json");
    this.load.json("data:items", "assets/data/items.json");

    this.load.image('tile:blank', 'assets/images/blank.png');
};

GAME.Preload.prototype.create = function() {
    GAME.json = {};
    GAME.json['units'] = this.cache.getJSON("data:units");
    GAME.json['items'] = this.cache.getJSON("data:items");

    this.state.start("Level");
};
