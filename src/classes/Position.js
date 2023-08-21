/**
 * @property {number} x
 * @property {number} y
 */
export default class Position {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    description(){
        return "[ x : " + this.x + ", y : " + this.y + " ]";
    }
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @return {Position}
 */
export function roundedPosition(x,y){
    return new Position(Math.round(x), Math.round(y));
}