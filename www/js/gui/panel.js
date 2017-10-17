function Panel(game) {
    Phaser.Group.call(this, game);

    this.createBackground();
    this.createMinimap();
    this.createStats();
    this.createInventory();

    this.onInventorySlotSelected = new Phaser.Signal();
    this.onMinimapSelected = new Phaser.Signal();
};

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = 144;
    background.height = this.game.height;
    background.tint = 0x333333;
};

Panel.prototype.createMinimap = function() {
    this.minimap = this.backgroundContainer.create(0, 0, "tile:blank");
    this.minimap.width = this.minimap.height = 100;
    this.minimap.x = this.minimap.y = (this.backgroundContainer.width - this.minimap.width) / 2;
    this.minimap.tint = 0xffffff;

    this.minimap.inputEnabled = true;
    this.minimap.events.onInputUp.add(this.onMinimapClicked, this);
};

Panel.prototype.createStats = function() {
    let startY = (this.minimap.y) + this.minimap.height + 10;

    let texts = ["Health", "Hunger"];

    this.stats = {};

    texts.forEach(single_text => {
        let label = this.game.add.bitmapText(0, startY, "font:gui", single_text, 10);
        label.tint = 0xffffff;
        label.x = (this.backgroundContainer.width - label.width)/2;

        this.addChild(label);

        startY += label.height + 4;

        let sprite = this.backgroundContainer.create(0, startY, "tile:blank");
        sprite.tint = 0x220000;
        sprite.width = 100;
        sprite.height = 10;
        sprite.x = (this.backgroundContainer.width - sprite.width)/2;

        let progress = this.backgroundContainer.create(0, startY, "tile:blank");
        progress.tint = 0xff0000;
        progress.width = 100;
        progress.height = 10;
        progress.x = (this.backgroundContainer.width - sprite.width)/2;

        label = this.game.add.bitmapText(this.backgroundContainer.width/2, startY + progress.height, "font:gui", "20 / 100", 10);
        label.anchor.set(0.5, 1);
        label.tint = 0xffffff;

        this.stats[single_text.toLowerCase()] = {'text':label, 'progress':progress};

        startY += progress.height + 4;
    });

    console.log(this.stats);
};

Panel.prototype.createInventory = function() {
    let padding = 16;

    this.inventory = [];

    for (let y=0; y<2; y++) {
        for (let x=0; x<2; x++) {
            let tile = this.backgroundContainer.create(0, 0, "tile:blank");
            tile.width = tile.height = 48;

            tile.x = (x == 0 ? padding : this.backgroundContainer.width - tile.width - padding);
            tile.y = this.backgroundContainer.height - tile.height - padding;
            if (y == 0 ) {
                tile.y -= tile.height + padding;
            }

            tile.inputEnabled = true;
            tile.events.onInputUp.add(this.onInventorySlotClicked, this);

            this.inventory.push(tile);
        }
    }
};

Panel.prototype.updateUnit = function(unit) {
    this.stats['hunger']['text'].text = unit.hunger + ' / ' + unit.maxHunger;
    this.stats['hunger']['progress'].width = Math.floor(unit.hunger / unit.maxHunger * 100);

    this.stats['health']['text'].text = unit.health + ' / ' + unit.maxHealth;
    this.stats['health']['progress'].width = Math.floor(unit.health / unit.maxHealth * 100);
};

Panel.prototype.onInventorySlotClicked = function(slot, pointer) {
    this.onInventorySlotSelected.dispatch(slot);
};

Panel.prototype.onMinimapClicked = function(minimap, pointer) {
    this.onMinimapSelected.dispatch(this.minimap);
}