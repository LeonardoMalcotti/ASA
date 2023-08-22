import Action from "./Action.js";

export default class GoRight extends Action {
	constructor() {
		super();
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs){
		//console.log("execute: GoRight");
		return client.move("right");
	}
}