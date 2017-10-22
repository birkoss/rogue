function PanelPopupEquipment(game) {
    PanelPopup.call(this, game);

    this.onEquipmentSlotSelected = new Phaser.Signal();

    this.createControls("Equipment");

    this.createSlots();
};

PanelPopupEquipment.prototype = PanelPopup.prototype;
PanelPopupEquipment.prototype.constructor = PanelPopup;

PanelPopupEquipment.prototype.createSlots = function() {
    this.slotsContainer = this.game.add.group();
    this.addChild(this.slotsContainer);

    let slots = [
        {slot: "head"},
        {slot: "jewel"},
        {slot: "body"},
        {slot: "armor"},
        {slot: "hand"},
        {slot: "foot"}
    ];

    for (let i=0; i<slots.length; i++) {
        let y = Math.floor(i / 2);
        let x = i - (y * 2);

        let slot = new Slot(this.game);
        slot.slotID = slots[i].slot;
        slot.onSlotClicked.add(this.onSlotClicked, this);

        slot.x = x * (slot.width + 18);
        slot.y = y * (slot.height + 30);
        this.slotsContainer.addChild(slot);

        if (GAME.equipment[slots[i].slot] != null) {
            slot.addItem(GAME.equipment[slots[i].slot]);
        }

        let label = this.game.add.bitmapText(slot.x, slot.y - 14, "font:gui", slots[i].slot, 10);
        label.tint = 0xffffff;
        label.x += (slot.width - label.width)/2;
        this.slotsContainer.addChild(label);
    }

    this.slotsContainer.y = this.controls.height + 50;
    this.slotsContainer.x = (this.backgroundContainer.width - this.slotsContainer.width) / 2;
};

PanelPopupEquipment.prototype.updateEquipment = function() {
    console.log("UPDATE EQUIPMENT", this);
    this.slotsContainer.forEach(single_slot => {
        if (single_slot.slotID) {
            if (GAME.equipment[single_slot.slotID] == null) {
                single_slot.clear();
            } else {
                single_slot.addItem(GAME.inventory[single_slot.slotID]);
            }
        }
    });
}


PanelPopupEquipment.prototype.onSlotClicked = function(slot) {
    console.log("OUI");
    this.onEquipmentSlotSelected.dispatch(slot);
};