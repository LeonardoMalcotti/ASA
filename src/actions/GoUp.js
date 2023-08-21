import Action from "./Action.js";

export default class GoUp extends Action {
	/**
	 * @param {DeliverooApi} client
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client){
		console.log("execute: GoUp");
		return client.move("up");
	}
}