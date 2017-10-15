var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('tile:floors', 'images/tiles/floors.png', 24, 24);
        this.load.spritesheet('tile:grass', 'images/tiles/grass.png', 24, 24);
        this.load.spritesheet('tile:effects', 'images/tiles/effects.png', 24, 24);
        this.load.image('tile:blank', 'images/tiles/blank.png');
        
        this.load.image('question', 'images/question.png')
        this.load.image('popup', 'images/popup.png');
        this.load.spritesheet('button:answer', 'images/answer.png', 45, 49);
        this.load.spritesheet('button:long', 'images/button.png', 190, 49);

        this.load.image('timer', 'images/question/timer.png');
        this.load.image('timer-right', 'images/question/timer-right.png');
        this.load.image('timer-left', 'images/question/timer-left.png');

        this.load.spritesheet('effect:attack', 'images/tiles/effects/attack.png', 30, 30);
        this.load.spritesheet('effect:health', 'images/tiles/effects/health.png', 14, 12);
        this.load.spritesheet('unit:skeleton', 'images/tiles/units/skeleton.png', 24, 24);

        this.load.spritesheet('item:potion', 'images/tiles/items/potion.png', 24, 24);

        this.load.spritesheet('card:normal', 'images/cards/normal.png', 24, 24);
        this.load.spritesheet('card:empty', 'images/cards/empty.png', 24, 24);
        this.load.spritesheet('card:error', 'images/cards/error.png', 24, 24);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');

        this.load.image('progress-bar:background', 'images/progress-bar/background.png');
        this.load.image('progress-bar:filling', 'images/progress-bar/filling.png');
        this.load.image('progress-bar:border', 'images/progress-bar/border.png');

        this.load.audio('sfx:click', 'audio/click.wav');

    },
    create: function() {
        this.state.start("Game");
    }
};