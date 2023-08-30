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
	 * @param {BeliefSet} beliefs
	 * @return {Promise<(Object | false)>}
	 */
	async execute(beliefs) {
		return await beliefs.client.shout(this.msg);
	}
}