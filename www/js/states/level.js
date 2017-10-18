var GAME = GAME || {};

GAME.Level = function() {};

/* Phaser */

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createItems();

    this.createUnits();

    this.helpersContainer = this.game.add.group();
    this.effectsContainer = this.game.add.group();

    this.createPanel();

    /* @TODO: Remove */
    /*
    this.panel.addItem(this.itemsContainer.getChildAt(0));
    this.panel.addItem(this.itemsContainer.getChildAt(1));
    this.panel.addItem(this.itemsContainer.getChildAt(2));
    */
};

GAME.Level.prototype.update = function() {
    if (this.currentUnit == null) {
        this.updateATB();
    }
    if (this.unit != null) {
        this.panel.updateUnit(this.unit);
    }
};

/* Creation */

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
    let unitTile = this.map.getTile(10, 3);
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
            let enemy = new Enemy(this.game, "ghost");
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

/* Helpers */

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

/* Actions */

GAME.Level.prototype.moveUnit = function(unit, x, y) {
    let tile = this.map.getTile(x, y);
    unit.move(tile.worldX, tile.worldY);
};

GAME.Level.prototype.attackUnit = function(attacker, defender) {
    let attackerTile = this.map.getTileWorldXY(attacker.x, attacker.y);
    let defenderTile = this.map.getTileWorldXY(defender.x, defender.y);

    let pf = new Pathfinding(this.getTiles(defender.type), this.map.width, this.map.height);
    let path = pf.find({x:attackerTile.x, y:attackerTile.y}, {x:defenderTile.x, y:defenderTile.y});
    let distance = path.length;

    let nx = attacker.x;
    let ny = attacker.y;

    /* Face the defender */
    if (attacker.x < defender.x) {
        attacker.face(Unit.Facing.Right);
    } else if (attacker.x > defender.x) {
        attacker.face(Unit.Facing.Left);
    }

    this.unitsContainer.swap(attacker, this.unitsContainer.getChildAt(this.unitsContainer.children.length - 1));

    if (distance == 1) {
        let tween = this.game.add.tween(attacker).to({x:defender.x, y:defender.y}, 100);
        tween.onComplete.add(function() {
            let effect = new Effect(this.game, attacker.x, attacker.y, "attack");
            this.effectsContainer.addChild(effect);
            effect.onEffectComplete.add(function() {
                this.applyDamage(defender, 1);

                let tween = this.game.add.tween(attacker).to({x:nx, y:ny}, 100);
                tween.onComplete.add(function() {
                    this.endTurn();
                }, this);
                tween.start();
            }, this);
        }, this);
        tween.start();
    } else {
        let projectile = this.effectsContainer.create(attacker.x, attacker.y, 'effect:blood');
        projectile.anchor.set(0.5, 0.5);
        projectile.animations.add('idle', [0, 1], 8, true);
        projectile.animations.play('idle');

        let tween = this.game.add.tween(projectile).to({x:defender.x, y:defender.y}, 500);
        tween.onComplete.add(function() {
            projectile.destroy();

            let effect = new Effect(this.game, defender.x, defender.y, "attack");
            this.effectsContainer.addChild(effect);
            effect.onEffectComplete.add(function() {
                this.applyDamage(defender, 1);

                this.endTurn();
            }, this);
        }, this);
        tween.start();
    }
};

GAME.Level.prototype.applyDamage = function(unit, amount) {
    unit.takeDamage(amount);

    /* Remove the dead unit from the list */
    if (!unit.isAlive()) {
        this.units.forEach((single_unit, index) => {
            if (single_unit == unit) {
                this.units.splice(index, 1);
            }
        });
    }
};

GAME.Level.prototype.useItem = function(item) {
    if (item != null && item.data.effects != null) {
        item.data.effects.forEach(single_effect => {
            console.log(single_effect.type);
            switch (single_effect.type) {
                case "health":
                    this.currentUnit.heal(single_effect.amount);
                    break;
                case "hunger":
                    this.currentUnit.eat(single_effect.amount);
                    break;
            }
        });
    }

    this.endTurn();
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

    this.endTurn();
};

/* Turns */

GAME.Level.prototype.startTurn = function() {
    let unit = this.currentUnit;

    if (unit.type == Unit.Type.Player) {
        let tiles = this.getTiles();
        let unitTile = this.map.getTileWorldXY(this.unit.x, this.unit.y);

        for (let y=-unit.range; y<=unit.range; y++) {
            for (let x=-unit.range; x<=unit.range; x++) {
                if ((y == 0 || x == 0) && (Math.abs(x) + Math.abs(y) > 0)) {
                    let nx = unitTile.x + x;
                    let ny = unitTile.y + y;
                    
                    let tile = this.map.getTile(nx, ny);
                    let distance = Math.abs(Math.abs(x) - Math.abs(y));

                    if (tiles[ (ny * this.map.width) + nx] == 0) {
                        if (distance == 1) {
                            let sprite = this.helpersContainer.create(tile.worldX, tile.worldY, 'helper:move');
                            sprite.tint = 0x00ff00;
                            sprite.inputEnabled = true;
                            sprite.events.onInputUp.add(function() {
                                this.helpersContainer.removeAll(true);
                                this.moveUnit(this.unit, nx, ny);
                            }, this);
                        }
                    } else {
                        if (distance <= unit.range) {
                            this.units.forEach(single_unit => {
                                let unitTile = this.map.getTileWorldXY(single_unit.x, single_unit.y);
                                if (unitTile.x == tile.x && unitTile.y == tile.y) {
                                    let sprite = this.helpersContainer.create(tile.worldX, tile.worldY, 'helper:attack');
                                    sprite.tint = 0xff0000;
                                    sprite.inputEnabled = true;
                                    sprite.events.onInputUp.add(function() {
                                        this.helpersContainer.removeAll(true);
                                        this.attackUnit(this.unit, single_unit);
                                    }, this);
                                }
                            });
                        }
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
            /* Attack if in range */
            if (path.length <= unit.range) {
                this.attackUnit(unit, this.unit);
            } else if (path.length > 1) {
                this.moveUnit(unit, path[0].x, path[0].y);
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

GAME.Level.prototype.endTurn = function() {
    this.helpersContainer.removeAll(true);
    this.currentUnit.clearATB();
    this.currentUnit = null;
};

/* ATB */

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
    popup.onItemUsed.add(this.useItem, this);
    popup.hasActionTaken.add(function() {
        this.endTurn();
    }, this);
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

            /* If possible, add the item under the player in the panel */
            if (unitTile.x == itemTile.x && unitTile.y == itemTile.y) {
                if (single_item.data.pickable == null || single_item.data.pickable) {
                    this.panel.addItem(single_item);
                } else {
                    if (single_item.data.triggers != null) {
                        single_item.data.triggers.forEach(single_trigger => {
                            switch (single_trigger.type) {
                                case "level":
                                    alert("@TODO: NEXT LEVEL")
                                    break;
                            }
                        });
                    }
                }
            }
        });
    }
    this.endTurn();
};