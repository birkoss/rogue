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
    let startY = (this.minimap.y * 2) + this.minimap.height;

    let texts = ["Health: 20", "Hunger: 100"];

    texts.forEach(single_text => {
        let label = this.game.add.bitmapText(0, startY, "font:gui", single_text, 10);
        label.anchor.set(0.5, 1);
        label.x = this.backgroundContainer.width/2;
        label.tint = 0xffffff;

        this.addChild(label);

        startY += label.height + 4;
    });
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

};

Panel.prototype.onInventorySlotClicked = function(slot, pointer) {
    this.onInventorySlotSelected.dispatch(slot);
};

Panel.prototype.onMinimapClicked = function(minimap, pointer) {
    this.onMinimapSelected.dispatch(this.minimap);
}