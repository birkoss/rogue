function PanelPopupMinimap(game) {
    PanelPopup.call(this, game);

    this.createControls("Minimap");

    let legends = [];
    legends.push({color:0x00ff00, text:"Player"});    
    legends.push({color:0x000000, text:"Walls"});    
    legends.push({color:0xffff00, text:"Items"});    
    legends.push({color:0xff0000, text:"Enemies"});    
    
    this.legendsContainer = this.game.add.group();
    this.add(this.legendsContainer);

    let startY = 10;
    legends.forEach(single_legend => {
        let tile = this.legendsContainer.create(10, startY, "tile:blank");
        tile.tint = single_legend.color;
        tile.width = tile.height = 10;

        let label = this.game.add.bitmapText(tile.x + tile.width + 10, startY, "font:gui", single_legend.text, 10);
        label.tint = 0xffffff;
        this.legendsContainer.addChild(label);

        startY += label.height + 10;
        console.log(startY);
    });

    this.legendsContainer.y = 40;
};

PanelPopupMinimap.prototype = PanelPopup.prototype;
PanelPopupMinimap.prototype.constructor = PanelPopup;

PanelPopupMinimap.prototype.createMap = function(map, units, items) {
    this.onShown.add(this.onPopupShown, this);

    this.map = map;
    this.units = units;
    this.items = items;
};

PanelPopupMinimap.prototype.onPopupShown = function() {
    this.mapContainer = this.game.add.group();
    this.add(this.mapContainer);
    this.mapContainer.x = this.backgroundContainer.width;

    let background = this.mapContainer.create(0, 0, "tile:blank");
    background.width = this.game.width - this.backgroundContainer.width;
    background.height = this.game.height;
    background.tint = 0x000000;
    background.inputEnabled = true;

    /* Find the tile size depending on the smallest size available */
    let smallerSize = Math.min(this.game.height, this.mapContainer.width);
    let size = Math.floor(smallerSize / this.map.width);
    let padding = 3;

    /* Create the minimap */
    this.minimap = this.mapContainer.create(0, 0, "tile:blank");
    this.minimap.width = this.minimap.height = this.map.width * size;
    this.minimap.x = (this.mapContainer.width - this.minimap.width) / 2;
    this.minimap.y = (this.mapContainer.height - this.minimap.height) / 2;
    this.minimap.tint = 0xffffff;

    let mapGraphics = this.game.add.graphics(0, 0);
    mapGraphics.beginFill(0x000000, 1);
    for (let y=0; y<this.map.height; y++) {
        for (let x=padding; x<this.map.width; x++) {
            if (this.map.layers[1].data[y][x].index != -1) {
                mapGraphics.drawRect((x-padding)*size, y*size, size, size);
            }
        }
    }
    this.mapContainer.addChild(mapGraphics);

    mapGraphics.beginFill(0xffff00);
    this.items.forEach(single_item => {
        let itemTile = this.map.getTileWorldXY(single_item.x, single_item.y);
        mapGraphics.drawRect((itemTile.x-padding)*size, itemTile.y*size, size, size);
    });

    this.units.forEach(single_unit => {
        let unitTile = this.map.getTileWorldXY(single_unit.x, single_unit.y);
        mapGraphics.beginFill(single_unit.type == Unit.Type.Player ? 0x00ff00 : 0xff0000);
        mapGraphics.drawRect((unitTile.x-padding)*size, unitTile.y*size, size, size);
    });

    mapGraphics.x = this.minimap.x + ((this.minimap.width-mapGraphics.width)/2);
    mapGraphics.y = this.minimap.y + ((this.minimap.height-mapGraphics.height)/2);

    /* Show the minimap */
    this.mapContainer.alpha = 0;
    this.game.add.tween(this.mapContainer).to({alpha:1}, 500).start();
}