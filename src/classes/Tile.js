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
    constructor(x,y, destination = false) {
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

    /**
     * @param {Position} position
     * @return {Tile}
     */
    static fromPosition(position){
        return new Tile(position.x,position.y);
    }
    
    hash(){
        return "t" + this.x + "-" + this.y;
    }
}