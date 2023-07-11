
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

export class Tile {
    x;
    y;
    destination;

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {boolean} destination
     */
    constructor(x,y, destination) {
        this.x = x;
        this.y = y;
        this.destination = destination;
    }
}

export class aNode {
    tile;
    g;
    h;
    f;
    parent;
    neighbors;

    /**
     *
     * @param {Tile} tile
     * @param {number} g
     * @param {number} h
     * @param {number} f
     * @param {aNode} parent
     */
    constructor(tile, g, h, f, parent) {
        this.tile = tile;
        this.g = g;
        this.h = h;
        this.f = f;
        this.parent = parent;
    }
}