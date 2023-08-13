import Position from "./Position.js";

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

    /**
     * @return {Position}
     */
    toPosition() {
        return new Position(this.x,this.y);
    }
}