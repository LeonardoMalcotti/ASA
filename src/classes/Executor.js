export default class Executor {
	/** @type {Plan} */
	currentPlan;
	/** @type {boolean} */
	stopped;
	/** @type {DeliverooApi} */
	client;

	/**
	 * @param {DeliverooApi} client
	 */
	constructor(client) {
		this.currentPlan = undefined;
		this.stopped = true;
		this.client = client;
	}

	async execute_plan(){
		if(this.currentPlan === undefined){
			return null;
		}

		for(let action of this.currentPlan.actions){

		}
	}
}