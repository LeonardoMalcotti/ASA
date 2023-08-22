export default class Action {
	
	/** @type {boolean} */
	optional;
	
	constructor() {
		this.optional = false;
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @return {Promise<(Object | false)>}
	 */
	async execute(client){
		return false;
	}
}