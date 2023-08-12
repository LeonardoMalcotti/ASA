import Position from "./Position.js";

export default class ParcelBelief {
     /**
     * @param {string} id
     * @param {Position} position
     * @param {string} held_by
     * @param {number} reward
     * @param {Destination} nearest_destination
     * @param {number} time
     * @param {number} probability
     */
    constructor(id, position, held_by, reward, nearest_destination, time, probability) {
        this.id = id;
        this.position = position;
        this.held_by = held_by;
        this.reward = reward;
        this.nearest_destination = nearest_destination;
        this.time = time;
        this.probability = probability;
    }

    /**
     * @param {ParcelData} data
     * @return ParcelBelief
     */
    static fromParcelData(data) {
        return new ParcelBelief(data.id, new Position(data.x,data.y),data.carriedBy === null ? "" : data.carriedBy,data.reward,null, Date.now(), 1);
    }
}
