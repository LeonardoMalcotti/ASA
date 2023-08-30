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
}