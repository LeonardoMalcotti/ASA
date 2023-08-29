import Action from "./Action.js";

export default class Say extends Action {
	/** @type {string} */
	to;
	/** @type {Message} */
	msg;
	
	/**
	 *
	 * @param {string} to
	 * @param {Message} msg
	 */
	constructor(to, msg) {
		super();
		this.to = to;
		this.msg = msg;
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<(Object | false)>}
	 */
	async execute(client, beliefs) {
		return await client.say(this.to,this.msg);
	}
}