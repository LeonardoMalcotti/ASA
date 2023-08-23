export default class Action {
	
	/** @type {boolean} */
	optional;
	
	constructor() {
		this.optional = false;
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @param {Plan} plan
	 * @return {Promise<(Object | false)>}
	 */
	async execute(client, beliefs, plan){
		return false;
	}
}