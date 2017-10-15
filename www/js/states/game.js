var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.game.stage.backgroundColor = 0x262626;

        this.mapContainer = this.game.add.group();

        this.map = new Map(this.game);
        this.mapContainer.addChild(this.map);

        this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
    },
    showPopup: function(label) {
        this.popup = new Popup(this.game, label);
        this.popupContainer.addChild(this.popup);
        this.popupContainer.x = (this.game.width - this.popupContainer.width) / 2;
        this.popupContainer.originalY = (this.game.height - this.popupContainer.height - this.popupContainer.x);

        this.popupContainer.y = -this.game.height;
        let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, 1000, Phaser.Easing.Elastic.Out);
        tween.start();
    }
};
