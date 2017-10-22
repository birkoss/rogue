function PanelPopup(game) {
    Phaser.Group.call(this, game);

    this.hasActionTaken = new Phaser.Signal();
    this.onShown = new Phaser.Signal();

    this.createBackground();
};

PanelPopup.prototype = Object.create(Phaser.Group.prototype);
PanelPopup.prototype.constructor = PanelPopup;

PanelPopup.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.inputEnabled = true;
    background.width = 144;
    background.height = this.game.height;
    background.tint = 0x333333;
};

PanelPopup.prototype.createControls = function(newLabel, newY) {
    if (newY == null) {
        newY = 0;
    }
    this.controls = this.backgroundContainer.create(0, newY, "tile:blank");
    this.controls.width = this.backgroundContainer.width;
    this.controls.height = 26;
    this.controls.tint = 0x000000;

    let label = this.game.add.bitmapText(0, newY+8, "font:gui", newLabel, 10);
    label.tint = 0xffffff;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    if (newY == 0) {
        let sprite = this.backgroundContainer.create(2, 2, "helper:back");
        sprite.inputEnabled = true;
        sprite.events.onInputUp.add(this.onBackButtonClicked, this);
    }
};



PanelPopup.prototype.show = function(newX) {
    if (newX == null) {
        newX = 0;
    }
    this.x = -this.width;
    let tween = this.game.add.tween(this).to({x:newX}, 200, Phaser.Easing.Linear.None);
    tween.onComplete.add(function() {
        this.onShown.dispatch();
    }, this);
    tween.start();
};

PanelPopup.prototype.hide = function() {
    let tween = this.game.add.tween(this).to({x:-this.width}, 200, Phaser.Easing.Linear.None);
    tween.start();
};

PanelPopup.prototype.onBackButtonClicked = function(button, pointer) {
    this.hide();
};

PanelPopup.prototype.endTurn = function() {
    this.hasActionTaken.dispatch();
}