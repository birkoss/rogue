function Slot(game) {
    Phaser.Group.call(this, game);

    let background = this.create(0, 0, "tile:blank");
    background.width = 48;
    background.height = 48;
    background.tint = 0xffffff;
    background.inputEnabled = true;
    background.events.onInputUp.add(this.onItemClicked, this);

    this.onSlotClicked = new Phaser.Signal();
};

Slot.prototype = Object.create(Phaser.Group.prototype);
Slot.prototype.constructor = Slot;

Slot.prototype.addItem = function(item) {
    this.item = new Item(this.game, item);

    this.item.x += this.width/2;
    this.item.y += this.height/2;

    this.addChild(this.item);
};

Slot.prototype.clear = function() {
    if (this.item != null) {
        this.removeChild(this.item);
        this.item.destroy();
        this.item = null;
    }
};

Slot.prototype.onItemClicked = function(slot, pointer) {
    if (this.item != null) {   
        this.onSlotClicked.dispatch(this);
    }
};