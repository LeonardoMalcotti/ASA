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
		console.log("executing plan");

		if(this.stopped){
			console.log("plan stopped");
			return false;
		}

		if(this.currentPlan === undefined){
			console.log("no plan");
			return false;
		}

		console.log(this.currentPlan)

		for(let action of this.currentPlan.actions){
			let result = await action.execute(this.client);
			console.log(result);
			if(!result) {
				return false;
			}

			if(this.stopped){
				return false;
			}
		}

		return true;
	}

	/**
	 * @param {Plan} plan
	 */
	set_new_plan(plan){
		this.stopped = true;
		this.currentPlan = plan;
		this.stopped = false;
	}

	stop_plan(){
		this.stopped = true;
	}
}