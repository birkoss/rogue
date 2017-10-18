function PanelPopupItem(game) {
    PanelPopup.call(this, game);

    this.onItemDropped = new Phaser.Signal();

    this.createControls("Item");
};

PanelPopupItem.prototype = PanelPopup.prototype;
PanelPopupItem.prototype.constructor = PanelPopup;

PanelPopupItem.prototype.createItem = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = 64;
    background.height = 64;
    background.tint = 0xffffff;

    background.x = (this.backgroundContainer.width - background.width) / 2;
    background.y = this.controls.height;

    let sprite = this.backgroundContainer.create(0, 0, "tileset:items");
    sprite.anchor.set(0.5, 0.5);
    sprite.frame = this.item.data.frame;
    sprite.x = background.x + background.width/2;
    sprite.y = background.y + background.height/2;

    let label = this.game.add.bitmapText(0, background.y + background.height + 10, "font:gui", this.item.data.name, 10);
    label.tint = 0xffffff;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    label = this.game.add.bitmapText(0, label.y + label.height + 10, "font:gui", this.item.data.description, 10);
    label.tint = 0xffffff;
    label.maxWidth = this.backgroundContainer.width - 20;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    let buttons = [];
    if (this.item.data.usable) {
        buttons.push({label:"Use", callback:this.onUseButtonClicked, context:this});
    }

    buttons.push({label:"Drop", callback:this.onDropButtonClicked, context:this});
    this.createButtons(buttons);
};

PanelPopupItem.prototype.setItem = function(item, slot) {
    this.item = item;
    this.slot = slot;

    this.createItem();
};

PanelPopupItem.prototype.onUseButtonClicked = function(button, pointer) {
    this.slot.item = null;
    this.item.destroy();

    this.hide();
};

PanelPopupItem.prototype.onDropButtonClicked = function(button, pointer) {
    this.onItemDropped.dispatch(this.item);
    
    this.slot.item = null;
    this.item.destroy();

    this.hide();
};