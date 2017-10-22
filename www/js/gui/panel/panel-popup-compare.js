function PanelPopupCompare(game) {
    PanelPopup.call(this, game);

    this.onEquipmentChangeSelected = new Phaser.Signal();

    this.createControls("Replace");

    let buttons = [];
    buttons.push({label:"Change", callback:this.onChangeButtonClicked, context:this});
    this.createButtons(buttons);
};

PanelPopupCompare.prototype = PanelPopup.prototype;
PanelPopupCompare.prototype.constructor = PanelPopup;

PanelPopupCompare.prototype.setItems = function(inventoryItemID, equipmentItemID) {

    this.itemContainer = this.game.add.group();
    this.add(this.itemContainer);

    this.existingSlot = new Slot(this.game);
    this.existingSlot.x = (this.backgroundContainer.width - this.existingSlot.width) / 2;
    this.existingSlot.y = this.controls.height + 10;
    this.itemContainer.addChild(this.existingSlot);

    this.existingSlot.addItem(equipmentItemID);

    let label = this.game.add.bitmapText(0, this.existingSlot.y + this.existingSlot.height + 10, "font:gui", this.existingSlot.item.data.name, 10);
    label.tint = 0xffffff;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    label = this.game.add.bitmapText(0, label.y + label.height + 10, "font:gui", (this.existingSlot.item.data.identified != false ? this.existingSlot.item.data.description : "I wonder what this does..."), 10);
    label.tint = 0xffffff;
    label.maxWidth = this.backgroundContainer.width - 20;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    this.createControls("with", label.y + label.height + 10);

    this.newSlot = new Slot(this.game);
    this.newSlot.x = (this.backgroundContainer.width - this.newSlot.width) / 2;
    this.newSlot.y = this.controls.y + this.controls.height + 10;
    this.itemContainer.addChild(this.newSlot);

    this.newSlot.addItem(inventoryItemID);

    label = this.game.add.bitmapText(0, this.newSlot.y + this.newSlot.height + 10, "font:gui", this.newSlot.item.data.name, 10);
    label.tint = 0xffffff;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);

    label = this.game.add.bitmapText(0, label.y + label.height + 10, "font:gui", (this.newSlot.item.data.identified != false ? this.newSlot.item.data.description : "I wonder what this does..."), 10);
    label.tint = 0xffffff;
    label.maxWidth = this.backgroundContainer.width - 20;
    label.x = (this.backgroundContainer.width - label.width)/2;
    this.addChild(label);
};


PanelPopupEquipment.prototype.onChangeButtonClicked = function(button, pointer) {
    console.log("OUI");
    this.onEquipmentChangeSelected.dispatch(this.newSlot.item.itemID);
};