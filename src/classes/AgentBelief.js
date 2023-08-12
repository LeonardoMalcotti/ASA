import {roundedPosition} from "./Position.js";

/**
 * @class AgentBelief
 * @property {string} id
 * @property {string} name
 * @property {Position} position
 * @property {number} score
 * @property {string} direction
 * @property {number} time
 * @property {number} probability
 * @property {Intention} intention
 */
export default class AgentBelief {
    /**
     * @param {string} id
     * @param {string} name
     * @param {Position} position
     * @param {number} score
     * @param {string} direction
     * @param {number} time
     * @param {number} probability
     * @param {Intention} intention
     */
    constructor(id, name, position, score, direction, time, probability, intention) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.score = score;
        this.direction = direction;
        this.time = time;
        this.probability = probability;
        this.intention = intention;
    }

    /**
     * @param {AgentData} data
     * @return AgentBelief
     */
    static fromAgentData(data){
        return new AgentBelief(data.id,data.name,roundedPosition(data.x,data.y),data.score,"",Date.now(), 1, null);
    }
}