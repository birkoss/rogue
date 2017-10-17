var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.waitingForPlayerAction = false;
        this.currentUnit = 0;

        this.game.input.onDown.add(this.onMouseDown, this);
        this.game.input.onUp.add(this.onMouseUp, this);

        this.game.stage.backgroundColor = 0x262626;



        //  Create our map (the 16x16 is the tile size)
        this.map = this.game.add.tilemap('level:1', 48, 48);

        //  'tiles' = cache image key, 24x24 = tile size
        this.map.addTilesetImage('world', 'tileset:world');
        this.map.addTilesetImage('items', 'tileset:items');


        this.layers = {};

        this.layers.floor = this.map.createLayer(0);
        this.layers.walls = this.map.createLayer(1);

        //  Scroll it
        this.layers.floor.resizeWorld();

        this.map.setCollisionBetween(1, 10000, true, this.layers.walls);

        this.unitsContainer = this.game.add.group();

        this.units = [];

        this.unit = new Unit(this.game, Unit.Type.Player);//this.game.add.sprite(160, 90, 'unit:skeleton');
        this.unit.health = 20;
        let unitTile = this.map.getTile(5,2);
        this.unit.x = unitTile.worldX;
        this.unit.y = unitTile.worldY;
        this.unit.hasMoved.add(this.unitHaveMoved, this);
        this.game.camera.follow(this.unit);
        let tile = this.map.getTileWorldXY(this.unit.x, this.unit.y);
        this.unit.x = tile.worldX + (this.unit.width/2);
        this.unit.y = tile.worldY + (this.unit.height/2);
        this.unitsContainer.addChild(this.unit);
        this.units.push(this.unit);

        this.layers.floor.resizeWorld();

        let tiles = this.game.cache.getTilemapData('level:1').data.layers[3].data;

        tiles.forEach((single_tile, index) => {
            if (single_tile > 0) {
                let y = Math.floor(index / this.map.width);
                let x = index - (y * this.map.width);

                let tile = this.map.getTile(x, y);
                let enemy = new Unit(this.game, Unit.Type.AI);
                enemy.hasMoved.add(this.unitHaveMoved, this);
                enemy.x = tile.worldX + (enemy.width/2);
                enemy.y = tile.worldY + (enemy.height/2);
                this.unitsContainer.addChild(enemy);
                this.units.push(enemy);
            }
        });

        this.effectsContainer = this.game.add.group();

        this.startTurn();

    },
    update: function() {
        //this.unitHealth.text = this.map.unit.health;
        /*
        this.physics.arcade.collide(this.unit, this.layers.walls);

            this.unit.body.velocity.x = 0;
            if (this.leftKey.isDown) {
                this.unit.body.velocity.x += 100;
                console.log("OUI");
            }

            */

            if (this.waitingForPlayerAction && this.nextDestination != null) {
                this.showPath();
            }

    },
    showPopup: function(label) {
        this.popup = new Popup(this.game, label);
        this.popupContainer.addChild(this.popup);
        this.popupContainer.x = (this.game.width - this.popupContainer.width) / 2;
        this.popupContainer.originalY = (this.game.height - this.popupContainer.height - this.popupContainer.x);

        this.popupContainer.y = -this.game.height;
        let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, 1000, Phaser.Easing.Elastic.Out);
        tween.start();
    },
    onMapNeedPopup: function(label) {
        this.showPopup(label);
    },
    onMouseDown: function(pointer) {
        if (this.waitingForPlayerAction) {
            this.nextDestination = {x:-1, y:-1};
        }        
    },
    onMouseUp: function(pointer) {
        if (this.waitingForPlayerAction) {
            this.nextDestination = null;
            if (this.path.length > 0 && !this.isMoving) {
                this.waitingForPlayerAction = false;
                this.moveUnit(this.unit, this.path[0].x, this.path[0].y);
            }
        }
    },
    showPath: function() {
        let tile = this.map.getTileWorldXY(this.game.input.worldX, this.game.input.worldY);

        if (this.nextDestination.x != tile.x || this.nextDestination.y != tile.y) {
            this.nextDestination.x = tile.x;
            this.nextDestination.y = tile.y;

            var pf = new Pathfinding(this.getTiles(), this.map.width, this.map.height);

            let unitTile = this.getUnitPosition(this.unit);

            this.path = pf.find({x:unitTile.x, y:unitTile.y}, {x:tile.x, y:tile.y});

            this.effectsContainer.removeAll(true);
            this.path.forEach(singlePath => {
                let tile = this.map.getTile(singlePath.x, singlePath.y, this.layers.floor);
                this.effectsContainer.create(tile.worldX, tile.worldY, 'path');
            });
        }
        
    },
    getUnitPosition: function(unit) {
        return this.map.getTileWorldXY(unit.x - (unit.width/2), unit.y - (unit.height/2));
    },
    moveUnit: function(unit, x, y) {
        let tile = this.map.getTile(x, y);
        unit.move(tile.worldX, tile.worldY);
    },
    attackUnit: function(attacker, defender) {
        let nx = attacker.x;
        let ny = attacker.y;

        /*
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
                console.log(defender.health);
                if (!defender.isAlive()) {
                    this.units.forEach((single_unit, index) => {
                        if (single_unit == defender) {
                            console.log("removed..." + index);;
                            this.units.splice(index, 1);
                            console.log(this.units);
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
    },
    unitHaveMoved: function(unit) {
        let unitTile = this.map.getTileWorldXY(unit.x, unit.y);
        this.effectsContainer.children.forEach(single_effect => {
            if (single_effect.x == unitTile.worldX && single_effect.y == unitTile.worldY) {
                single_effect.destroy();
            }
        });
        this.endTurn();
    },
    getTiles: function() {
        let tiles = this.game.cache.getTilemapData('level:1').data.layers[1].data.slice(0);

        this.units.forEach(single_unit => {
            if (single_unit.type == Unit.Type.AI) {
                let tile = this.map.getTileWorldXY(single_unit.x, single_unit.y);
                tiles[ (tile.y * this.map.width) + tile.x ] = 1;
            }
        });

        return tiles;
    },
    startTurn: function() {
        let unit = this.units[this.currentUnit];
        if (unit.type == Unit.Type.Player) {
            //this.waitingForPlayerAction = true;
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
        } else {
            let pf = new Pathfinding(this.getTiles(), this.map.width, this.map.height);

            let unitTile = this.getUnitPosition(unit);
            let playerTile = this.getUnitPosition(this.unit);

            this.path = pf.find({x:unitTile.x, y:unitTile.y}, {x:playerTile.x, y:playerTile.y});
            if (this.path.length > 1) {
                this.moveUnit(unit, this.path[0].x, this.path[0].y);
            } else if (this.path.length == 1) {
                this.attackUnit(unit, this.unit);
            } else {
                this.endTurn();
            }
        }
    },
    endTurn: function() {
        this.currentUnit++;
        if (this.currentUnit >= this.units.length) {
            this.currentUnit = 0;
        }

        console.log("END TURN: " + this.currentUnit);

        this.startTurn();
    }
};
