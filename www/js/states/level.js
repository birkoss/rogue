var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createItems();

    this.createUnits();

    this.effectsContainer = this.game.add.group();

    this.createPanel();

    /* @TODO: Remove */
    this.panel.addItem(this.itemsContainer.getChildAt(0));
    this.panel.addItem(this.itemsContainer.getChildAt(1));
    this.panel.addItem(this.itemsContainer.getChildAt(2));
};

GAME.Level.prototype.update = function() {
    if (this.currentUnit == null) {
        this.updateATB();
    }
    if (this.unit != null) {
        this.panel.updateUnit(this.unit);
    }
};

GAME.Level.prototype.createMap = function() {
    this.map = this.game.add.tilemap('level:1', 48, 48);

    this.map.addTilesetImage('world', 'tileset:world');

    // Create layers
    this.layers = {};
    this.layers.floor = this.map.createLayer(0);
    this.layers.walls = this.map.createLayer(1);

    this.layers.floor.resizeWorld();
};


GAME.Level.prototype.createUnits = function() {
    this.unitsContainer = this.game.add.group();
    this.units = [];
    this.currentUnit = null;

    /* Create the player */
    this.unit = new Player(this.game);
    let unitTile = this.map.getTile(4, 8);
    this.unit.x = unitTile.worldX + (this.unit.width/2);
    this.unit.y = unitTile.worldY + (this.unit.width/2);
    this.unit.hasMoved.add(this.unitHaveMoved, this);
    this.game.camera.follow(this.unit);

    this.unitsContainer.addChild(this.unit);
    this.units.push(this.unit);

    /* Create the enemies based on the 3rd layer */
    let tiles = this.game.cache.getTilemapData('level:1').data.layers[3].data;

    tiles.forEach((single_tile, index) => {
        if (single_tile > 0) {
            let y = Math.floor(index / this.map.width);
            let x = index - (y * this.map.width);

            let tile = this.map.getTile(x, y);
            let enemy = new Enemy(this.game);
            enemy.hasMoved.add(this.unitHaveMoved, this);
            enemy.x = tile.worldX + (enemy.width/2);
            enemy.y = tile.worldY + (enemy.height/2);
            this.unitsContainer.addChild(enemy);
            this.units.push(enemy);
        }
    });
};

GAME.Level.prototype.createItems = function() {
    this.itemsContainer = this.game.add.group();

    /* Create the enemies based on the 3rd layer */
    let tiles = this.game.cache.getTilemapData('level:1').data.layers[2].data;

    tiles.forEach((single_tile, index) => {
        if (single_tile > 0) {
            let y = Math.floor(index / this.map.width);
            let x = index - (y * this.map.width);

            let tile = this.map.getTile(x, y);
            let item = new Item(this.game, "key");
            item.x = tile.worldX + 24;
            item.y = tile.worldY + 24;
            this.itemsContainer.addChild(item);
        }
    });
};

GAME.Level.prototype.createPanel = function() {
    this.panel = new Panel(this.game);
    this.panel.onInventorySlotSelected.add(this.onPanelInventorySlotClicked, this);
    this.panel.onMinimapSelected.add(this.onPanelMinimapClicked, this);
    this.panel.x = this.game.width - this.panel.width;
    this.panel.fixedToCamera = true;
};

GAME.Level.prototype.showPopup = function(label) {
    this.popup = new Popup(this.game, label);
    this.popupContainer.addChild(this.popup);
    this.popupContainer.x = (this.game.width - this.popupContainer.width) / 2;
    this.popupContainer.originalY = (this.game.height - this.popupContainer.height - this.popupContainer.x);

    this.popupContainer.y = -this.game.height;
    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, 1000, Phaser.Easing.Elastic.Out);
    tween.start();
};

GAME.Level.prototype.getUnitPosition = function(unit) {
    return this.map.getTileWorldXY(unit.x - (unit.width/2), unit.y - (unit.height/2));
};

GAME.Level.prototype.getItemPosition = function(item) {
    return this.map.getTileWorldXY(item.x - (item.width/2), item.y - (item.height/2));
};

GAME.Level.prototype.getItemAt = function(x, y) {
    let item = null;
    this.itemsContainer.forEach(single_item => {
        let itemTile = this.getItemPosition(single_item);
        if (itemTile.x == x && itemTile.y == y) {
            item = single_item;
        }
    });
    return item;
}

GAME.Level.prototype.moveUnit = function(unit, x, y) {
    let tile = this.map.getTile(x, y);
    unit.move(tile.worldX, tile.worldY);
};
GAME.Level.prototype.attackUnit = function(attacker, defender) {
    let nx = attacker.x;
    let ny = attacker.y;

    /* Face the defender */
    if (attacker.x < defender.x) {
        attacker.face(Unit.Facing.Right);
    } else if (attacker.x > defender.x) {
        attacker.face(Unit.Facing.Left);
    }

    this.unitsContainer.swap(attacker, this.unitsContainer.getChildAt(this.unitsContainer.children.length - 1));

    let tween = this.game.add.tween(attacker).to({x:defender.x, y:defender.y}, 100);
    tween.onComplete.add(function() {
        let sprite = this.effectsContainer.create(attacker.x, attacker.y, 'effect:attack');
        sprite.anchor.set(0.5, 0.5);
        sprite.animations.add('idle', [0, 1, 0, 1, 0], 8, false);
        sprite.animations.currentAnim.onComplete.add(function() {
            sprite.destroy();

            defender.takeDamage(1);

            if (!defender.isAlive()) {
                this.units.forEach((single_unit, index) => {
                    if (single_unit == defender) {
                        this.units.splice(index, 1);
                    }
                });
            }

            let tween = this.game.add.tween(attacker).to({x:nx, y:ny}, 100);
            tween.onComplete.add(function() {
                this.endTurn();
            }, this);
            tween.start();
        }, this);
        sprite.animations.play('idle');
    }, this);
    tween.start();
};

GAME.Level.prototype.getTiles = function(excludedType) {
    let tiles = this.game.cache.getTilemapData('level:1').data.layers[1].data.slice(0);

    this.units.forEach(single_unit => {
        if (excludedType == null || excludedType != single_unit.type) {
            let tile = this.map.getTileWorldXY(single_unit.x, single_unit.y);
            tiles[ (tile.y * this.map.width) + tile.x ] = 1;
        }
    });

    return tiles;
};

GAME.Level.prototype.startTurn = function() {
    let unit = this.currentUnit;

    if (unit.type == Unit.Type.Player) {
        let tiles = this.getTiles();
        let unitTile = this.map.getTileWorldXY(this.unit.x, this.unit.y);

        for (let y=-1; y<=1; y++) {
            for (let x=-1; x<=1; x++) {
                if (Math.abs(x) != Math.abs(y)) {
                    let nx = unitTile.x + x;
                    let ny = unitTile.y + y;
                    
                    let tile = this.map.getTile(nx, ny);

                    if (tiles[ (ny * this.map.width) + nx] == 0) {
                        let sprite = this.effectsContainer.create(tile.worldX, tile.worldY, 'helper:move');
                        sprite.tint = 0x00ff00;
                        sprite.inputEnabled = true;
                        sprite.events.onInputUp.add(function() {
                            this.effectsContainer.removeAll(true);
                            this.moveUnit(this.unit, nx, ny);
                        }, this);
                    } else {
                        this.units.forEach(single_unit => {
                            let unitTile = this.map.getTileWorldXY(single_unit.x, single_unit.y);
                            if (unitTile.x == tile.x && unitTile.y == tile.y) {
                                let sprite = this.effectsContainer.create(tile.worldX, tile.worldY, 'helper:attack');
                                sprite.tint = 0xff0000;
                                sprite.inputEnabled = true;
                                sprite.events.onInputUp.add(function() {
                                    this.effectsContainer.removeAll(true);
                                    this.attackUnit(this.unit, single_unit);
                                }, this);
                            }
                        });
                    }
                }
            }
        }
    } else if (unit.type == Unit.Type.Enemy) {

        let unitTile = this.getUnitPosition(unit);
        let playerTile = this.getUnitPosition(this.unit);

        let pf = new Pathfinding(this.getTiles(Unit.Type.Player), this.map.width, this.map.height);
        let path = pf.find({x:unitTile.x, y:unitTile.y}, {x:playerTile.x, y:playerTile.y});

        if (unit.isActive()) {
            if (path.length > 1) {
                this.moveUnit(unit, path[0].x, path[0].y);
            } else if (path.length == 1) {
                this.attackUnit(unit, this.unit);
            } else {
                this.endTurn();
            }
        } else {
            /* Check if we are near the player */
            if (path.length <= 4) {
                /* @TODO: Show a red ! scalling back and forth on top of the enemy */
                unit.target = this.unit;
                this.endTurn();
            } else {
                this.endTurn();
            }
        }
    }
};

GAME.Level.prototype.dropItem = function(item) {
    let position = null;
    let unitTile = this.getUnitPosition(this.unit);

    /* Try under the unit */
    if (this.getItemAt(unitTile.x, unitTile.y) == null) {
        position = {x: unitTile.x, y:unitTile.y};
    }

    /* Else, try around adjacent to the player */
    if (position == null) {
        let maxDepth = 3;
        let positions = [{x:-1, y:0, ok:true}, {x:1, y:0, ok:true}, {x:0, y:-1, ok:true}, {x:0, y:1, ok:true}];
        for (let d=1; d<=maxDepth; d++) {
            positions.forEach(single_position => {
                if (single_position.ok) {
                    let nx = (single_position.x * d) + unitTile.x;
                    let ny = (single_position.y * d) + unitTile.y;

                    if (this.map.getTile(nx, ny) == null) {
                        single_position.ok = false;
                    } else {
                        let tiles = this.getTiles(Unit.Type.Player);
                        if (tiles[(ny * this.map.width) + nx] != 0) {
                            single_position.ok = false;
                        } else if (position == null && this.getItemAt(nx, ny) == null) {
                            position = {x:nx, y:ny};
                        }
                    }
                }
            });
        }
    }

    /* Drop the item in the next free slot */
    if (position != null) {
        let tile = this.map.getTile(position.x, position.y);
        item.x = tile.worldX + 24;
        item.y = tile.worldY + 24;
        this.itemsContainer.addChild(item);
    } else {
        /* If we can't find a spot for the item, destroy it... */
        item.destroy();
    }
};

GAME.Level.prototype.endTurn = function() {
    this.currentUnit.clearATB();
    this.currentUnit = null;
};

GAME.Level.prototype.updateATB = function() {
    this.currentUnit = null;

    /* Check for units ready to action */
    this.units.forEach(function(single_unit) {
        if (this.currentUnit == null && single_unit.isReady()) {
            this.currentUnit = single_unit;
        }
    }, this);

    /* Update the ATB if no units are ready */
    if (this.currentUnit == null) {
        this.units.forEach(function(single_unit) {
            if (single_unit.isAlive()) {
                single_unit.updateATB();
            }
        }, this);
    } else {
        this.startTurn();
    }
};

/* Events */

GAME.Level.prototype.onPanelInventorySlotClicked = function(slot) {
    var popup = new PanelPopupItem(this.game);
    popup.onItemDropped.add(this.dropItem, this);
    popup.setItem(slot.item, slot);
    this.panel.addChild(popup);

    popup.show();
};

GAME.Level.prototype.onPanelMinimapClicked = function(minimap) {

};

GAME.Level.prototype.unitHaveMoved = function(unit) {
    if (unit.type == Unit.Type.Player) {
        let unitTile = this.getUnitPosition(unit);
        this.itemsContainer.forEach(single_item => {
            let itemTile = this.getUnitPosition(single_item);

            if (unitTile.x == itemTile.x && unitTile.y == itemTile.y) {
                this.panel.addItem(single_item);

//                this.itemsContainer.removeChild(single_item);
                //single_item.destroy();
            }
        });
    }
    this.endTurn();
};