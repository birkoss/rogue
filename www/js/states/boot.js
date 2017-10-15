var GAME = GAME || {};

GAME.Boot = function() {};

GAME.Boot.prototype = {
    preload: function() {
        this.load.image('gui:preloader', 'images/gui/preloader.png');
    },
    create: function() {
        this.game.backgroundColor = '#fff';

        /* Scale the game using the RATIO */
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.scale.setUserScale(RATIO, RATIO);

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        /*
         *
         *
         *
         *scaling options this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //have the game centered horizontally this.scale.pageAlignHorizontally = true; this.scale.pageAlignVertically = true; //screen size will be set automatically this.scale.setScreenSize(true);

         *
         */

        /* Enable crisp rendering */
        this.game.renderer.renderSession.roundPixels = true;  
        this.game.stage.smoothed = false;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
};
