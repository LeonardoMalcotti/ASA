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
	 * @param {BeliefSet} beliefs
	 * @return {Promise<(Object | false)>}
	 */
	async execute(beliefs) {
		return await beliefs.client.say(this.to,this.msg);
	}
}