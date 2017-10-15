function PanelButton(game, label, spriteSheet, dimension) {
    Phaser.Group.call(this, game);

    this.spriteSheet = (spriteSheet != null ? spriteSheet : "");

    this.onClicked = new Phaser.Signal();

    this.init();

    this.isSelected = false;

    this.dimension = (dimension == null ? {width:120, height:40} : dimension);
    this.setLabel(label);
};

PanelButton.prototype = Object.create(Phaser.Group.prototype);
PanelButton.prototype.constructor = PanelButton;

PanelButton.prototype.init = function() {
    this.click = this.create(0, 0, "tile:blank");
    this.click.tint = 0xff00ff;
    this.click.alpha = 0;
    this.click.inputEnabled = true;
    this.click.events.onInputDown.add(this.showOver, this);
    this.click.events.onInputOut.add(this.moveOut, this);
    this.click.events.onInputUp.add(this.showNormal, this);

    this.background = new Ninepatch(this.game, "gui:btnNormal" + this.spriteSheet);
    this.background.inputEnabled = true;
    this.addChild(this.background);
};

PanelButton.prototype.lock = function() {
   this.click.inputEnabled = false;
};

PanelButton.prototype.setImage = function(image) {
    this.image = this.create(0, 0, image);
    this.label.x += this.image.width/2;
    if (this.subtitle != null) {
        this.subtitle.x += this.image.width/2;
    }
};

PanelButton.prototype.setLabel = function(newLabel) {
    this.label = this.game.add.bitmapText(0, 0, "font:gui", newLabel, 10);
    this.label.anchor.set(0.5, 0.5);
    this.label.x += this.label.width/2;
    this.label.y += this.label.height/2;
    this.label.y -= 3;
    this.addChild(this.label);

    this.background.resize(this.dimension.width, this.dimension.height);
    this.getChildAt(0).width = this.dimension.width;
    this.getChildAt(0).height = this.dimension.height;

    this.label.x += (this.background.width - this.label.width) / 2;
    this.label.y += (this.background.height - this.label.height) / 2;

    this.label.originalY = this.label.y;
};

PanelButton.prototype.setSubtitle = function(newSubtitle) {
    this.subtitle = this.game.add.bitmapText(0, 0, "font:gui", newSubtitle, 10);
    this.subtitle.anchor.set(0.5, 0.5);
    this.subtitle.x += this.subtitle.width/2;
    this.subtitle.y += this.subtitle.height/2;
    this.addChild(this.subtitle);

    this.background.resize(this.dimension.width, this.dimension.height);
    this.getChildAt(0).width = this.dimension.width;
    this.getChildAt(0).height = this.dimension.height;

    this.subtitle.x += (this.background.width - this.subtitle.width) / 2;
    this.subtitle.y += (this.background.height - this.subtitle.height) / 2;

    this.subtitle.y += 10;

    this.label.y -= (this.subtitle.height/2) + 4;
};

PanelButton.prototype.disable = function() {
    this.alpha = 0;
};

PanelButton.prototype.enable = function() {
    this.alpha = 1;
};

PanelButton.prototype.showOver = function(sprite, pointer) {
    if (this.alpha == 1) {
        this.isSelected = true;
        this.background.changeTexture("gui:btnOver" + this.spriteSheet);
        this.label.y += 5;
    }
};

PanelButton.prototype.showNormal = function(sprite, pointer) {
    this.background.changeTexture("gui:btnNormal" + this.spriteSheet);
    this.label.y = this.label.originalY;
    if (this.alpha == 1 && this.isSelected && this.click.input.pointerOver()) {
        this.isSelected = false;
        this.onClicked.dispatch(this);
    }
};

PanelButton.prototype.moveOut = function(sprite, pointer) {
    if (this.isSelected) {
        this.isSelected = false;
        this.background.changeTexture("gui:btnNormal" + this.spriteSheet);
    }
};
