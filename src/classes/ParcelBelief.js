import Position from "./Position.js";

/**
 * Represent the current belief about a single parcel.
 * @property {string} id the unique identifier of the parcel.
 * @property {Position} position the current believed coordinate on the map of the parcel.
 * @property {string} held_by the id of the agent holding the parcel, empty string if there is no one.
 * @property {number} reward the current believed reward of the parcel.
 * @property {Destination} nearest_destination to be removed i guess.
 * @property {number} time the last time the belief has been updated.
 * @property {number} probability the probability that the belief is actually true.
 */
export default class ParcelBelief {

    /** the unique identifier of the parcel.
     * @type {string}
     */
    id;
    /** the current believed coordinate on the map of the parcel.
     * @type {Position}
     */
    position;
    /** the id of the agent holding the parcel, empty string if there is no one.
     * @type {string}
     */
    held_by;
    /** the current believed reward of the parcel.
     * @type {number}
     */
    reward;
    /** the last time the belief has been updated.
     * @type {number}
     */
    time;
    /** the probability that the belief is actually true.
     * @type {number}
     */
    probability;

     /**
     * @param {string} id
     * @param {Position} position
     * @param {string} held_by
     * @param {number} reward
     * @param {number} time
     * @param {number} probability
     */
    constructor(id, position, held_by, reward, time, probability) {
        this.id = id;
        this.position = position;
        this.held_by = held_by;
        this.reward = reward;
        this.time = time;
        this.probability = probability;
    }

    /**
     * @param {ParcelData} data
     * @return ParcelBelief
     */
    static fromParcelData(data) {
        return new ParcelBelief(data.id, new Position(data.x,data.y),data.carriedBy,data.reward, Date.now(), 1);
    }
    
    /**
     * @return {ParcelData}
     */
    toParcelData(){
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            carriedBy : this.held_by,
            reward : this.reward
        };
    }
    
    reward_after_n_steps(beliefs, steps) {
        let decay_interval = beliefs.config.PARCEL_DECADING_INTERVAL;
        let movement_speed = beliefs.config.MOVEMENT_DURATION;
        let movement_steps = beliefs.config.MOVEMENT_STEPS;
        
        let seconds = (steps / movement_steps) * (movement_speed/1000)
        switch (decay_interval) {
            case "1s": return this.reward - Math.round(seconds);
            case "2s": return this.reward - Math.round(seconds/2);
            case "5s": return this.reward - Math.round(seconds/5);
            case "10s": return this.reward - Math.round(seconds/10);
            case "infinite": return this.reward;
        }
    }
    
    reward_after_n_seconds(beliefs, seconds){
        let decay_interval = beliefs.config.PARCEL_DECADING_INTERVAL;
        switch (decay_interval) {
            case "1s": return this.reward - Math.round(seconds);
            case "2s": return this.reward - Math.round(seconds/2);
            case "5s": return this.reward - Math.round(seconds/5);
            case "10s": return this.reward - Math.round(seconds/10);
            case "infinite": return this.reward;
        }
    }
}


/**
 * Give the reward of this parcel after the agent has traveled the given number of steps.
 * @param {BeliefSet} beliefs
 * @param {ParcelBelief} parcel
 * @param {number} steps
 * @return {number}
 */
/*
export function reward_after_n_steps(beliefs, parcel, steps) {
    let decay_interval = beliefs.config.PARCEL_DECADING_INTERVAL;
    let movement_speed = beliefs.config.MOVEMENT_DURATION;
    let movement_steps = beliefs.config.MOVEMENT_STEPS;
    
    let seconds = (steps / movement_steps) * (movement_speed/1000)
    switch (decay_interval) {
        case "1s": return parcel.reward - Math.round(seconds);
        case "2s": return parcel.reward - Math.round(seconds/2);
        case "5s": return parcel.reward - Math.round(seconds/5);
        case "10s": return parcel.reward - Math.round(seconds/10);
        case "infinite": return parcel.reward;
    }
}*/

/**
 * @param {BeliefSet} beliefs
 * @param {ParcelBelief} parcel
 * @param {number} seconds
 * @return {number}
 */
/*
export function reward_after_n_seconds(beliefs,parcel, seconds){
    let decay_interval = beliefs.config.PARCEL_DECADING_INTERVAL;
    switch (decay_interval) {
        case "1s": return parcel.reward - Math.round(seconds);
        case "2s": return parcel.reward - Math.round(seconds/2);
        case "5s": return parcel.reward - Math.round(seconds/5);
        case "10s": return parcel.reward - Math.round(seconds/10);
        case "infinite": return parcel.reward;
    }
}*/
