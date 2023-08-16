import Action from "./Action.js";

export default class GoLeft extends Action {
	/**
	 * @param {DeliverooApi} client
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client){
		return client.move("left");
	}
}