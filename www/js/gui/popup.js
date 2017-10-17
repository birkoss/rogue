function Popup(game, label) {
    Phaser.Group.call(this, game);

    this.createBackground();

    this.createAnswers();

    this.textContainer = this.game.add.group();
    this.addChild(this.textContainer);


    this.text = this.game.add.bitmapText(0, 0, "font:gui", label, 20);
    this.text.anchor.set(0.5, 0.5);
    this.textContainer.addChild(this.text);
    this.text.x = this.backgroundContainer.width/2;
    this.text.y = (this.backgroundContainer.height - this.answersContainer.height - 20)/2;
    this.text.tint = 0x575246;

    
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.backgroundContainer.create(0, 0, 'popup');
}

Popup.prototype.createAnswers = function() {
    this.answersContainer = this.game.add.group();
    this.addChild(this.answersContainer);

    let button = this.game.add.button(0, 0, 'button:long', this.onButtonClicked, this, 1, 0, 1);
    this.answersContainer.addChild(button);

        let text = this.game.add.bitmapText(0, 0, "font:gui", "Continuer", 20);
        text.anchor.set(0.5, 0.5);
        text.x = (button.width/2) - 1;
        text.y = (button.height/2) - 1;
        button.addChild(text);
        text.tint = 0xd4d8e9;


    this.answersContainer.x = (this.backgroundContainer.width-this.answersContainer.width) / 2;
    this.answersContainer.y = 230;
}

Popup.prototype.onButtonClicked = function(button, pointer) {
    this.game.state.restart();
}