function Card(game, cardText) {
    Phaser.Group.call(this, game);

    this.background = new Ninepatch(this.game, "card:normal");
    this.background.inputEnabled = true;
    this.addChild(this.background);

    this.background.resize(72, 80);

    this.label = this.game.add.bitmapText(0, 0, "font:gui", cardText+"", 20);
    this.label.tint = 0xf4f4f4;   // 0x7d7d7d
    this.label.anchor.set(0.5, 0.5);
    /*
    this.label.anchor.set(0.5, 0);
    this.label.x -= this.background.width/2;
    this.label.y -= this.background.height/2;
    */
    this.background.addChild(this.label);



    this.onClicked = new Phaser.Signal();
    this.canBeClicked = false;
};

Card.prototype = Object.create(Phaser.Group.prototype);
Card.prototype.constructor = Card;

Card.prototype.enableClick = function() {
    this.background.enableClick(this.cardClicked, this);
    this.canBeClicked = true;
}

Card.prototype.cardClicked = function(sprite, pointer) {
    if (this.canBeClicked) {
        this.onClicked.dispatch(this);        
    }
    this.canBeClicked = false;
}

