function Map(game, config) {
    Phaser.Group.call(this, game);

    this.gridWidth = Math.ceil(this.game.width/(GAME.config.spriteSize*GAME.config.scale));
    this.gridHeight = Math.ceil(this.game.height/(GAME.config.spriteSize*GAME.config.scale));
    this.gridWidth = this.gridHeight = 6;

    this.tiles = [];

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.tilesContainer = this.game.add.group();
    this.padding = 0;
    this.add(this.tilesContainer);

    this.unitContainer = this.game.add.group();
    this.addChild(this.unitContainer);




    this.createMap();

    this.createBackground();

    this.unit = new Unit(this.game);
    this.unit.hasMoved.add(this.unitHaveMoved, this);
    this.unitContainer.addChild(this.unit);
    this.reveal(0, 0);
    this.unit.setPosition(0, 0);

    //this.createFOW();

    this.tilesContainer.x = this.tilesContainer.y = this.padding;

    this.onMovePlayer = new Phaser.Signal();

    this.canMove = false;
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createBackground = function() {
    let background = this.backgroundContainer.create(0, 0, "tile:blank");
    background.width = this.tilesContainer.width + this.padding*2;
    background.height = this.tilesContainer.height + this.padding*2;
    background.tint = 0x2b2b2b;

    background.inputEnabled = true;
    background.events.onInputDown.add(this.moveStart, this);
    background.events.onInputUp.add(this.moveEnd, this);
};

Map.prototype.createMap = function() {
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let tile = new Tile(this.game);
            this.tilesContainer.addChild(tile);

            tile.gridX = gridX;
            tile.gridY = gridY;

            tile.x = gridX * (tile.width + this.padding);
            tile.y = gridY * (tile.height + this.padding);
        }
    }

    this.tilesContainer.getChildAt(2).addItem('potion');
};


Map.prototype.canMoveTo = function(x, y) {
    return (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight);
};

Map.prototype.reveal = function(x, y, fading = false) {
    let index = (y * this.gridWidth) + x;
    if (this.tilesContainer.getChildAt(index).isRevealed()) {
        //this.executeTile();
        this.moveUnit();
    } else {
        this.tilesContainer.getChildAt(index).reveal();
        this.tilesContainer.getChildAt(index).onReveal.add(function() {
            //this.executeTile();
            this.moveUnit();
        }, this);
       /*
        if (!fading) {
            for (let nx=-1; nx<=1; nx++) {
                for (let ny=-1; ny<=1; ny++) {
                    if (Math.abs(nx) != Math.abs(ny)) {
                        let tx = nx + x;
                        let ty = ny + y;
                        if (this.canMoveTo(tx, ty)) {
                            index = (ty * this.gridWidth) + tx;
                            this.tilesContainer.getChildAt(index).reveal(true);
                        }
                    }
                }
            }
        }  
        */      
    }
};

Map.prototype.moveUnit = function() {
    this.unit.move(this.unit.gridX, this.unit.gridY);
}

Map.prototype.executeTile = function() {
    this.canMove = true;

    console.log (this.getTileAt(this.unit.gridX, this.unit.gridY));
};

/* Helpers */

Map.prototype.getNeighboors = function(gridX, gridY, depth, increment, onlyAdjacent) {
    depth = depth || 1;
    increment = increment || 1;
    onlyAdjacent = onlyAdjacent || true;

    let neighboors = [];
    for (let y=-depth; y<=depth; y+=increment) {
        for (let x=-depth; x<=depth; x+=increment) {
            if (x != 0 || y != 0) {
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {

                    if (!onlyAdjacent || (gridX == newX || gridY == newY)) {
                        neighboors.push(this.tiles[newY][newX]);
                    }
                }
            }
        }
    }
    return neighboors;
};


Map.prototype.getTileAt = function(gridX, gridY) {
    let tile = null;

    this.tilesContainer.children.forEach(function (single_tile) {
        if (single_tile.gridX == gridX && single_tile.gridY == gridY) {
            tile = single_tile;
        }
    }, this);

    return tile;
};

/* Events */

Map.prototype.moveStart = function(map, pointer) {
    if (!this.canMove) {
        return;
    }
    this.startPosition = {'x':pointer.x, 'y':pointer.y};
};

Map.prototype.moveEnd = function(map, pointer) {
    if (!this.canMove) {
        return;
    }

    let treshold = 10;

    if (this.startPosition != null) {
        var distanceX = this.startPosition.x - pointer.x;
        var distanceY = this.startPosition.y - pointer.y;

        this.startPosition = null;

        if (Math.abs(distanceX) > treshold || Math.abs(distanceY) > treshold) {
            let position = {x:0, y:0};
            if (Math.abs(distanceX) > Math.abs(distanceY)) {
                position.x = (distanceX > 0 ? -1 : 1);
            } else {
                position.y = (distanceY > 0 ? -1 : 1);
            }

            let nx = this.unit.gridX + position.x;
            let ny = this.unit.gridY + position.y;
            if (this.canMoveTo(nx, ny)) {
                this.canMove = false;
                this.unit.gridX = nx;
                this.unit.gridY = ny;
                //this.unit.move(nx, ny);
                console.log(nx + "x" + ny);
                this.reveal(nx, ny);
            }
        }


    }
};

Map.prototype.unitHaveMoved = function() {
    //this.reveal(this.unit.gridX, this.unit.gridY);

    this.executeTile();
};