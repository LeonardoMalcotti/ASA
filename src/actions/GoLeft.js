import Action from "./Action.js";

export default class GoLeft extends Action {
	constructor() {
		super();
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs){
		//console.log("execute: GoLeft");
		return client.move("left");
	}
}