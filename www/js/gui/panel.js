function Panel(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.buttonsContainer = this.game.add.group();

    this.buttonToggleClicked = new Phaser.Signal();

    this.init();
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.init = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.game.width;
    background.height = 66;
    background.tint = 0x000000;

    /*
    this.button = new PanelButton(this.game, "Start");
    this.button.onClicked.add(this.onButtonClicked, this);
    this.backgroundContainer.addChild(this.button);
    */
};

Panel.prototype.addButton = function(button) {
    if (this.buttonsContainer.width > 0) {
        button.x = this.buttonsContainer.width + 6;
    }
    button.x += 6;

    button.y = (this.height - button.height) / 2;
    this.buttonsContainer.addChild(button);
};

Panel.prototype.onButtonClicked = function() {
    this.buttonToggleClicked.dispatch(this.button.label.text);

    this.button.label.text = (this.button.label.text == "Start" ? "Stop" : "Start");
};
