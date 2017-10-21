function PanelPopupItem(game, origin) {
    console.log("PanelPopupItem: ", origin);
    this.origin = origin;
    if (this.origin == null) {
        this.origin = "equipment";
    }
    PanelPopup.call(this, game);

    this.onItemDropped = new Phaser.Signal();
    this.onItemUsed = new Phaser.Signal();
    this.onItemEquipped = new Phaser.Signal();

    this.createControls("Item");

    this.itemContainer = this.game.add.group();
    this.add(this.itemContainer);

    this.slot = new Slot(this.game);
    this.slot.x = (this.backgroundContainer.width - this.slot.width) / 2;
    this.slot.y = this.controls.height + 100;
    this.itemContainer.addChild(this.slot);
};

PanelPopupItem.prototype = PanelPopup.prototype;
PanelPopupItem.prototype.constructor = PanelPopup;

PanelPopupItem.prototype.setItem = function(itemID) {
    this.slot.addItem(itemID);

    let label = this.game.add.bitmapText(0, this.slot.y + this.slot.height + 10, "font:gui", this.slot.item.data.name, 10);
    label.tint = 0xffffff;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    label = this.game.add.bitmapText(0, label.y + label.height + 10, "font:gui", (this.slot.item.data.identified != false ? this.slot.item.data.description : "I wonder what this does..."), 10);
    label.tint = 0xffffff;
    label.maxWidth = this.backgroundContainer.width - 20;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    let buttons = [];
    if (this.origin == "inventory") {
        if (this.slot.item.data.usable) {
            buttons.push({label:"Use", callback:this.onUseButtonClicked, context:this});
        }
        //if (this.slot.item.data.equipable) {
            buttons.push({label:"Equip", callback:this.onEquipButtonClicked, context:this});
        //}
    } else {
        buttons.push({label:"Unequip", callback:this.onEquipButtonClicked, context:this});
    }
    buttons.push({label:"Drop", callback:this.onDropButtonClicked, context:this});
    this.createButtons(buttons);
};

PanelPopupItem.prototype.onUseButtonClicked = function(button, pointer) {
    this.onItemUsed.dispatch(this.slot.item.itemID);
    this.hide();
};

PanelPopupItem.prototype.onEquipButtonClicked = function(button, pointer) {
    this.onItemEquipped.dispatch(this.slot.item.itemID);
};

PanelPopupItem.prototype.onDropButtonClicked = function(button, pointer) {
    this.onItemDropped.dispatch(this.slot.item.itemID, this.origin);
    this.hide();
};