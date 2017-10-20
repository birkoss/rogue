function Popup(game, popupText) {
    Phaser.Group.call(this, game);

    this.createOverlay();
    
    this.createBackground();


    this.label = this.game.add.bitmapText(0, 0, "font:gui", popupText, 20);
    this.label.tint = 0xff0000;
    this.label.maxWidth = this.overlayContainer.width - 20;
    this.label.x = (this.overlayContainer.width - this.label.width)/2;
    this.label.y = (this.overlayContainer.height - this.label.height)/2;
    this.backgroundContainer.addChild(this.label);

    this.fixedToCamera = true;
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.createOverlay = function() {
    this.overlayContainer = this.game.add.group();
    this.addChild(this.overlayContainer);

    let background = this.game.make.sprite(0, 0, "tile:blank");
    background.tint = 0x000000;
    background.width = this.game.width;
    background.height = this.game.height;
    background.inputEnabled = true;
   // background.fixedToCamera = true;

    background.alpha = 0.8;

    this.overlayContainer.addChild(background);
}

Popup.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    let background = this.game.make.sprite(0, 0, "tile:blank");
    background.tint = 0xffffff;
    background.width = this.game.width - 100;
    background.height = this.game.height - 100;
    background.inputEnabled = true;
    background.x = background.y = 50;
    //background.fixedToCamera = true;

    //background.cameraOffset.setTo(50, 50);

    this.backgroundContainer.addChild(background);
}

Popup.prototype.addButton = function(buttonLabel, callback, context) {
    let button = this.game.add.button(0, 0, "gui:button", callback, context, 0, 1, 0, 1);
    this.backgroundContainer.addChild(button);

    let label = this.game.add.bitmapText(0, 2, "font:gui", buttonLabel, 10);
    label.tint = 0xffffff;
    label.x = (button.width - label.width)/2;
    label.y = (button.height - label.height)/2;

    button.y = this.backgroundContainer.height - button.height - 20;
    button.x = (this.overlayContainer.width - button.width) / 2;
    button.addChild(label);
}

Popup.prototype.show = function() {
    this.overlayContainer.getChildAt(0).alpha = 0;

    let backgroundY = this.backgroundContainer.y;
    this.backgroundContainer.y = -this.game.height;

    let tween = this.game.add.tween(this.overlayContainer.getChildAt(0)).to({alpha:0.8}, 500);
    tween.onComplete.add(function() {
        let tween = this.game.add.tween(this.backgroundContainer).to({y:backgroundY}, 1300, Phaser.Easing.Elastic.Out);
        tween.start();
    }, this);
    tween.start();
}