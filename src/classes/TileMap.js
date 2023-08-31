
export class TileMap {
    /**
     * @type {Tile[]}
     */
    tiles;

    /**
     * @type {Tile[]}
     */
    delivery_tiles;

    constructor() {
        this.tiles = [];
        this.delivery_tiles = [];
    }

    /**
     * @param {Tile} tile
     */
    add(tile){
        this.tiles.push(tile);

        if(tile.destination){
            this.delivery_tiles.push(tile);
        }
    }

    /**
     * @param {Tile} tile
     * @return {Tile[]}
     */
    neighbors(tile){
        return this.tiles.filter((t) => (
            t.x === tile.x && t.y + 1 === tile.y ||
            t.x === tile.x && t.y - 1 === tile.y ||
            t.x + 1 === tile.x && t.y === tile.y ||
            t.x - 1 === tile.x && t.y === tile.y
        ))
    }
    
    copy(){
        let ret = new TileMap();
        ret.delivery_tiles = this.delivery_tiles.map((d) => d);
        ret.tiles = this.tiles.map((t) => t);
        return ret;
    }
}