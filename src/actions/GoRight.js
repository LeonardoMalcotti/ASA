import Action from "./Action.js";

export default class GoRight extends Action {
	constructor() {
		super();
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client){
		//console.log("execute: GoRight");
		return client.move("right");
	}
}