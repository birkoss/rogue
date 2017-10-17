var GAME = GAME || {};

GAME.Level = function() {};

GAME.Level.prototype.create = function() {
    this.game.stage.backgroundColor = 0x262626;

    this.createMap();

    this.createUnits();

    this.effectsContainer = this.game.add.group();
};

GAME.Level.prototype.update = function() {
    if (this.currentUnit == null) {
        this.updateATB();
    }
};

GAME.Level.prototype.createMap = function() {
    //  Create our map (the 16x16 is the tile size)
    this.map = this.game.add.tilemap('level:1', 48, 48);

    //  'tiles' = cache image key, 24x24 = tile size
    this.map.addTilesetImage('world', 'tileset:world');
    this.map.addTilesetImage('items', 'tileset:items');


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
    let unitTile = this.map.getTile(2,2);
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

GAME.Level.prototype.moveUnit = function(unit, x, y) {
    let tile = this.map.getTile(x, y);
    unit.move(tile.worldX, tile.worldY);
};
GAME.Level.prototype.attackUnit = function(attacker, defender) {
    let nx = attacker.x;
    let ny = attacker.y;

    /*
    // @TODO: Face the right direction
    if (attacker.x < defender.x) {
        attacker.scale.x = 1;
    } else if (attacker.x > defender.x) {
        attacker.scale.x = -1;
    }
    */


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

GAME.Level.prototype.unitHaveMoved = function(unit) {
    let unitTile = this.map.getTileWorldXY(unit.x, unit.y);
    this.effectsContainer.children.forEach(single_effect => {
        if (single_effect.x == unitTile.worldX && single_effect.y == unitTile.worldY) {
            single_effect.destroy();
        }
    });
    this.endTurn();
};

GAME.Level.prototype.getTiles = function() {
    let tiles = this.game.cache.getTilemapData('level:1').data.layers[1].data.slice(0);

    this.units.forEach(single_unit => {
        if (single_unit.type == Unit.Type.AI) {
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

        if (unit.isActive()) {
            let pf = new Pathfinding(this.getTiles(), this.map.width, this.map.height);
            this.path = pf.find({x:unitTile.x, y:unitTile.y}, {x:playerTile.x, y:playerTile.y});
            if (this.path.length > 1) {
                this.moveUnit(unit, this.path[0].x, this.path[0].y);
            } else if (this.path.length == 1) {
                this.attackUnit(unit, this.unit);
            } else {
                this.endTurn();
            }
        } else {
            /* Check if we are near the player */
            let pf = new Pathfinding(this.getTiles(), this.map.width, this.map.height);
            let path = pf.find({x:unitTile.x, y:unitTile.y}, {x:playerTile.x, y:playerTile.y});
            console.log(path.length);
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