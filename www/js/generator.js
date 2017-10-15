function Generator(game, rows, cols) {
    this.game = game;
    this.rows = rows;
    this.cols = cols;

    this.generate();
}

/*
 * Fill the Generator with some starting cell as active
 * */
Generator.prototype.fill = function(tiles, chanceToStartAlive) {
    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            if (this.game.rnd.integerInRange(0, 100) < chanceToStartAlive) {
                tiles[y][x] = 1;
            }
        }
    }

    return tiles;
}

/*
 * Apply the Conway's law to the Generator
 * */
Generator.prototype.simulate = function(tiles) {
    var deathLimit = 3;
    var birthLimit = 4;

    var new_tiles = this.createTiles();

    for (var y=0; y<this.cols; y++) {
        for (var x=0; x<this.rows; x++) {
            var count = this.countNeighbours(tiles, x, y);
            if (tiles[y][x] == 1) {
                new_tiles[y][x] = (count < deathLimit ? 0 : 1);
            } else {
                new_tiles[y][x] = (count > birthLimit ? 1 : 0);
            }
        }
    }
    return new_tiles;
};

/*
 * Get the total of active neighbours to a cell
 * */
Generator.prototype.countNeighbours = function(Generator, x1, y1) {
    var count = 0;

    for (var y2=-1; y2<=1; y2++) {
        for (var x2=-1; x2<=1; x2++) {
            var nx = x1 + x2;
            var ny = y1 + y2;

            if (x2 != 0 || y2 != 0) {
                if (nx < 0 || ny < 0 || nx >= this.rows || ny >= this.cols || Generator[ny][nx] == 1) {
                    count++;
                }
            }
        }
    }

    return count;
};

/*
 * Generate the Generator with trees and castles
 * */
Generator.prototype.generate = function() {
    var floor = this.createTiles();
    floor = this.fill(floor, 45);

    var maxSimulations = 10;
    while (maxSimulations-- > 0) {
        var new_floor = this.simulate(floor);
        if (new_floor == floor) {
            break;
        }
        floor = new_floor;
    }

    var tree = this.createTiles();
    tree = this.fill(tree, 35);
    tree = this.simulate(tree);
    tree = this.simulate(tree);

    this.map = {'floor':floor, 'trees':tree};
};

/*
 * Create a 2D tiles array
 * */
Generator.prototype.createTiles = function(default_value) {
    if (default_value == null) {
        default_value = 0;
    }

    var tiles = [];
    for (var y=0; y<this.cols; y++) {
        var rows = [];
        for (var x=0; x<this.rows; x++) {
            rows.push(default_value);
        }
        tiles.push(rows);
    }
    return tiles;
};

/*
 * Helper to determine if it's empty at a location
 * */
Generator.prototype.isEmpty = function(x, y) {

    if (!this.tiles[y][x].isWalkable) {
        return false;
    }
    if (this.trees[y][x] == 0) {
        return false;
    }
    return true;
};
