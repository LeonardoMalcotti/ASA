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
    /**
     * @type {("failed" | "stopped" | "completed" | "executing" | "new")}
     */
    status;

    constructor() {
        this.possible_reward = 0;
        this.possible_path = undefined;
        this.status = "new";
    }

    /**
     *
     * @param {BeliefSet} beliefs
     * @return {Promise<boolean>}
     */
    async achievable(beliefs){
        return false;
    }
    
    description() {
        return "None";
    }
    
    hash() {
        return "None";
    }
}