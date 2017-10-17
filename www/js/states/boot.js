var GAME = GAME || {};

GAME.Boot = function() {};

GAME.Boot.prototype.preload =  function() {
    this.load.image('gui:preloader', 'assets/images/preloader.png');
}

GAME.Boot.prototype.create = function() {
    this.game.backgroundColor = '#fff';

    /* Scale the game using the RATIO */
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.setUserScale(RATIO, RATIO);

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    /* Enable crisp rendering */
    this.game.renderer.renderSession.roundPixels = true;  
    this.game.stage.smoothed = false;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.state.start('Preload');
};
