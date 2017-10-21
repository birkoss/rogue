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


PanelPopupEquipment.prototype.onSlotClicked = function(slot) {
    console.log("OUI");
    this.onEquipmentSlotSelected.dispatch(slot);
};