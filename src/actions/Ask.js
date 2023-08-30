import Action from "./Action.js";

export default class Ask extends Action {
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
		console.log(beliefs.me.name + " asking : " + this.msg);
		let reply = await beliefs.client.ask(this.to,this.msg);
		console.log(beliefs.me.name + " reply received : " + reply);
		return reply;
	}
}