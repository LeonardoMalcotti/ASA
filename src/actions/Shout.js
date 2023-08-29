import Action from "./Action.js";

export default class Shout extends Action {
	
	/** @type {Message} */
	msg;
	
	/**
	 * @param {Message} msg
	 */
	constructor(msg) {
		super();
		this.msg = msg;
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<(Object | false)>}
	 */
	async execute(client, beliefs) {
		return await client.shout(this.msg);
	}
}