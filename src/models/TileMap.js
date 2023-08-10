
export class TileMap {
    /**
     * @type {Tile[]}
     */
    tiles;

    constructor() {
        this.tiles = [];
    }

    /**
     * @param {Tile} tile
     */
    add(tile){
        this.tiles.push(tile);
    }

    /**
     * @param {Tile} tile
     */
    neighbors(tile){
        return this.tiles.filter((t) => (
            t.x === tile.x && t.y + 1 === tile.y ||
            t.x === tile.x && t.y - 1 === tile.y ||
            t.x + 1 === tile.x && t.y === tile.y ||
            t.x - 1 === tile.x && t.y === tile.y
        ))
    }
}