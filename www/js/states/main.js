var GAME = GAME || {};

GAME.Main = function() {};

GAME.Main.prototype = {
    create: function() {
        this.backgroundContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        let popup = new Popup(this.game);
        let button = popup.addButton("Play", this.onPlayButtonClicked, this);
        this.buttonsContainer.addChild(button);
    },
    onPlayButtonClicked: function() {
        this.state.start('Game');
    }
};
