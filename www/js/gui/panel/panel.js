function Panel(game) {
    Phaser.Group.call(this, game);

    this.createBackground();

    this.createButtons([{label:'Equipment', callback:this.onButtonEquipmentClicked, context:this}, {label:'Map', callback:this.onButtonMinimapClicked, context:this}]);
    this.buttonsContainer.y = 10;

    this.createStats();
    this.createInventory();

    this.popupContainer = this.game.add.group();
    this.add(this.popupContainer);

    this.onInventorySlotSelected = new Phaser.Signal();
    this.onEquipmentSelected = new Phaser.Signal();
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

Panel.prototype.createStats = function() {
    let startY = (this.buttonsContainer.y) + this.buttonsContainer.height + 10;

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
        this.backgroundContainer.addChild(label);

        this.stats[single_text.toLowerCase()] = {'text':label, 'progress':progress};

        startY += progress.height + 4;
    });

    console.log(this.stats);
};

Panel.prototype.createButtons = function(buttons) {
    this.buttonsContainer = this.game.add.group();
    this.addChild(this.buttonsContainer);

    let startY = 0;
    buttons.forEach(single_button => {
        let button = this.game.add.button(0, startY, "gui:button", single_button.callback, single_button.context, 0, 1, 0, 1);
        this.buttonsContainer.addChild(button);

        let label = this.game.add.bitmapText(0, 2, "font:gui", single_button.label, 10);
        label.tint = 0xffffff;
        label.x = (button.width - label.width)/2;
        label.y = (button.height - label.height)/2;
        button.addChild(label);

        startY += button.height + 10;
    });

    this.buttonsContainer.x = (this.backgroundContainer.width - this.buttonsContainer.width) / 2;
    this.buttonsContainer.y = this.game.height - this.buttonsContainer.height - 10;
};

Panel.prototype.createInventory = function() {
    this.inventoryContainer = this.game.add.group();
    this.add(this.inventoryContainer);

    let padding = 16;

    let index = 0;
    for (let y=0; y<2; y++) {
        for (let x=0; x<2; x++) {
            let slot = new Slot(this.game);
            slot.onSlotClicked.add(this.onInventorySlotClicked, this);

            slot.x = (x == 0 ? padding : this.backgroundContainer.width - slot.width - padding);
            slot.y = this.backgroundContainer.height - slot.height - padding;
            if (y == 0 ) {
                slot.y -= slot.height + padding;
            }

            if (index < GAME.inventory.length) {
               slot.addItem(GAME.inventory[index]);
            }
            index++;

            this.inventoryContainer.addChild(slot);
        }
    }
};

Panel.prototype.updateUnit = function(unit, stat, amount) {
    this.stats['hunger']['text'].text = unit.hunger + ' / ' + unit.maxHunger;
    this.stats['hunger']['progress'].width = Math.floor(unit.hunger / unit.maxHunger * 100);

    this.stats['health']['text'].text = unit.health + ' / ' + unit.maxHealth;
    this.stats['health']['progress'].width = Math.floor(unit.health / unit.maxHealth * 100);
};

Panel.prototype.updateMap = function(map, items, units) {
    let size = 2;                                       // Size of each tile
    let padding = 3;                                    // Remove the first X rows
    if (this.minimapContainer.children.length == 0 ) {
        let mapGraphics = this.game.add.graphics(0, 0);
        mapGraphics.beginFill(0x000000, 1);
        for (let y=0; y<map.height; y++) {
            for (let x=padding; x<map.width; x++) {
                if (map.layers[1].data[y][x].index != -1) {
                    mapGraphics.drawRect((x-padding)*size, y*size, size, size);
                }
            }
        }
        this.minimapContainer.addChild(mapGraphics);
        console.log(mapGraphics.width);
    }

    for (let i=this.minimapContainer.children.length-1; i>=1; i--) {
        this.minimapContainer.removeChildAt(i);
    }

    let g = this.game.add.graphics(0, 0);

    g.beginFill(0xffff00);
    items.forEach(single_item => {
        let itemTile = map.getTileWorldXY(single_item.x, single_item.y);
        g.drawRect((itemTile.x-padding)*size, itemTile.y*size, size, size);
    });

    units.forEach(single_unit => {
        let unitTile = map.getTileWorldXY(single_unit.x, single_unit.y);
        g.beginFill(single_unit.Type == Unit.Type.Player ? 0x00ff00 : 0xff0000);
        g.drawRect((unitTile.x-padding)*size, unitTile.y*size, size, size);
    });

    this.minimapContainer.addChild(g);

    this.minimapContainer.x = this.minimap.x + ((this.minimap.width - this.minimapContainer.width) / 2);
    this.minimapContainer.y = this.minimap.y + (this.minimap.height - this.minimapContainer.height) / 2;
};

Panel.prototype.updateInventory = function() {
    for (let i=0; i<this.inventoryContainer.children.length; i++) {
        this.inventoryContainer.getChildAt(i).clear();
        if (i < GAME.inventory.length) {
            this.inventoryContainer.getChildAt(i).addItem(GAME.inventory[i]);
        }
    }   
};

Panel.prototype.addItem = function(item) {
    let emptySlot = null;
    this.inventoryContainer.forEach(single_slot => {
        if (emptySlot == null && single_slot.item == null) {
            emptySlot = single_slot;
        }
    });

    if (emptySlot != null) {
        //emptySlot.addItem(item);
        GAME.inventory.push(item);
        this.updateInventory();
        return true;
    }

    return false;
};

Panel.prototype.addPopup = function(popup) {
    this.popupContainer.addChild(popup);
}

Panel.prototype.closePopup = function() {
    let index = this.popupContainer.children.length - 1;

    let popup = this.popupContainer.getChildAt(index);
    this.popupContainer.removeChildAt(index);
    popup.destroy();
}

Panel.prototype.onInventorySlotClicked = function(slot, pointer) {
    if (slot.item != null) {        
        this.onInventorySlotSelected.dispatch(slot, "inventory");
    }
};

Panel.prototype.onButtonEquipmentClicked = function(button, pointer) {
    this.onEquipmentSelected.dispatch();
}

Panel.prototype.onButtonMinimapClicked = function(button, pointer) {
    console.log("..");
    this.onMinimapSelected.dispatch();
}