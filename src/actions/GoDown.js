import Action from "./Action.js";

export default class GoDown extends Action {
	/**
	 * @param {DeliverooApi} client
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client){
		return client.move("down");
	}
}