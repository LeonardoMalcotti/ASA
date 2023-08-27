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
    
    hash(){
        return "t" + this.x + "-" + this.y;
    }
    
    /**
     * @param {string} hash
     */
    static fromHash(hash){
        let st = hash.substring(1);
        let coord = st.split("-").map((c) => Number(c));
        return new Position(coord[0], coord[1]);
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