function Ninepatch(game, spriteSheet) {
    this.spriteSheet = spriteSheet;
    if (spriteSheet == undefined) {
        this.spriteSheet = 'popup:background';
    }

    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.borders = {bottom: true};

    this.init();
};

Ninepatch.prototype = Object.create(Phaser.Group.prototype);
Ninepatch.prototype.constructor = Ninepatch;

Ninepatch.prototype.removeBorders = function(position) {
    this.borders[position] = false;
};

Ninepatch.prototype.changeTexture = function(spriteSheet) {
    this.spriteSheet = spriteSheet;
    for (let i=0; i<this.backgroundContainer.children.length; i++) {
        this.backgroundContainer.getChildAt(i).loadTexture(spriteSheet, i);
    }
};

Ninepatch.prototype.enableClick = function(callback, context) {
    for (let i=0; i<this.backgroundContainer.children.length; i++) {
        this.backgroundContainer.getChildAt(i).inputEnabled = true;
        this.backgroundContainer.getChildAt(i).events.onInputDown.add(callback, context);
    }
};

Ninepatch.prototype.init = function() {
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            let sprite = this.backgroundContainer.create(0, 0, this.spriteSheet);
            sprite.scale.setTo(GAME.config.scale, GAME.config.scale);
            sprite.frame = (y * 3) + x;
            sprite.x = x * sprite.width;
            sprite.y = y * sprite.height;
        }
    }
    this.cornerSize = this.backgroundContainer.getChildAt(0).height;
};

Ninepatch.prototype.getCornerSize = function(direction) {
    let size = this.cornerSize;
    if (direction == 'y') {
        if (this.borders.bottom) {
            size *= 2;
        }
    } else {
        size *= 2;
    }
    return size;
};

Ninepatch.prototype.resize = function(newWidth, newHeight) {
    let cornerSize = this.backgroundContainer.getChildAt(0).width;
    let parts = new Array();

    if (newWidth != this.backgroundContainer.width) {
       parts = [1, 4, 7]; 
       for (let i=0; i<parts.length; i++) {
           this.backgroundContainer.getChildAt(parts[i]).width = newWidth - (cornerSize * 2);
           this.backgroundContainer.getChildAt(parts[i]+1).x = this.backgroundContainer.getChildAt(parts[i]).width + this.backgroundContainer.getChildAt(parts[i]).x;
       }
    }

    if (newHeight != this.backgroundContainer.height) {
       parts = [3, 4, 5]; 
       for (let i=0; i<parts.length; i++) {
           this.backgroundContainer.getChildAt(parts[i]).height = newHeight - (cornerSize * 2);
           this.backgroundContainer.getChildAt(parts[i]+3).y = this.backgroundContainer.getChildAt(parts[i]).height + this.backgroundContainer.getChildAt(parts[i]).y;
       }
    }

    /* Remove unwanted borders */
    parts = [];
    if (!this.borders.bottom) { parts = [8, 7, 6]; }

    for (let i=0; i<parts.length; i++) {
        this.backgroundContainer.getChildAt(parts[i]).destroy();
    }

    this.backgroundContainer.x -= this.backgroundContainer.width/2;
    this.backgroundContainer.y -= this.backgroundContainer.height/2;
};
