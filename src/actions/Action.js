import Ask from "./Ask.js";

export default class Action {
	
	/** @type {boolean} */
	optional;
	
	constructor() {
		this.optional = false;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<(Object | false)>}
	 */
	async execute(beliefs){
		return false;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @param {string} ally
	 * @return {Ask}
	 */
	asCollaborationAction(beliefs,ally){
		return new Ask(ally,{
				topic: this.constructor.name,
				token: beliefs.communication_token
			}
		);
	}
}