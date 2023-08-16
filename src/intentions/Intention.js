/**
 * @class Intention
 */
export class Intention {
    /**
     * @type {(undefined | Tile[])}
     */
    possible_path;
    /**
     * @type {number}
     */
    possible_reward;

    constructor() {
        this.possible_reward = 0;
        this.possible_path = undefined;
    }

    /**
     *
     * @param {BeliefSet} beliefs
     * @return {Promise<boolean>}
     */
    async achievable(beliefs){
        return false;
    }
}