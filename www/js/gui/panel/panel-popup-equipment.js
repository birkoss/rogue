function PanelPopupEquipment(game) {
    PanelPopup.call(this, game);

    this.onItemDropped = new Phaser.Signal();
    this.onItemUsed = new Phaser.Signal();
    this.onItemEquipped = new Phaser.Signal();

    this.createControls("Equipment");

    this.createSlots();
};

PanelPopupEquipment.prototype = PanelPopup.prototype;
PanelPopupEquipment.prototype.constructor = PanelPopup;

PanelPopupEquipment.prototype.createSlots = function() {
    let slots = [
        {slot: "head"},
        {slot: "jowel"},
        {slot: "body"},
        {slot: "armor"},
        {slot: "hand"},
        {slot: "foot"}
    ];

   let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = 64;
    background.height = 64;
    background.tint = 0xffffff;

    background.x = (this.backgroundContainer.width - background.width) / 2;
    background.y = this.controls.height;
};

PanelPopupEquipment.prototype.setItem = function(item, slot) {
    this.item = item;
    this.slot = slot;

    this.createItem();
};

PanelPopupEquipment.prototype.onUseButtonClicked = function(button, pointer) {
    this.slot.item = null;

    this.onItemUsed.dispatch(this.item);
    this.item.destroy();

    this.hide();
};

PanelPopupEquipment.prototype.onEquipButtonClicked = function(button, pointer) {
    this.onItemEquipped.dispatch(this.item);
};

PanelPopupEquipment.prototype.onDropButtonClicked = function(button, pointer) {
    this.slot.item = null;

    this.onItemDropped.dispatch(this.item);

    this.hide();
};