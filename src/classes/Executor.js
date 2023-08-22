export default class Executor {
	/** @type {Plan} */
	currentPlan;
	/** @type {boolean} */
	stopped;
	/** @type {boolean} */
	to_be_executed;
	/** @type {DeliverooApi} */
	client;

	/**
	 * @param {DeliverooApi} client
	 */
	constructor(client) {
		this.currentPlan = undefined;
		this.stopped = true;
		this.to_be_executed = false;
		this.client = client;
	}

	async execute_plan(){
		console.log("Executor.execute_plan : executing plan");
		
		if(!this.to_be_executed){
			console.log("Executor.execute_plan : plan not to be executed yet");
			this.stopped = true;
			return "invalid";
		}

		if(this.currentPlan === undefined){
			console.log("Executor.execute_plan : no plan");
			this.stop_plan();
			return "invalid";
		}
		
		this.to_be_executed = false;
		this.stopped = false;

		for(let action of this.currentPlan.actions){
			let retries = 3;
			let result = await action.execute(this.client);
			
			// retry the action max 3 times
			if(!result) {
				//console.log("Executor.execute_plan : action failed");
				while(retries > 0){
					//console.log("Executor.execute_plan : retry action");
					result = await action.execute(this.client);
					if(result) {
						//console.log(result);
						//console.log("Executor.execute_plan : action successful");
						retries = 0;
					} else {
						retries --;
						//console.log("Executor.execute_plan : action failed again -> retries remaining " + retries);
					}
				}
				if(!result) return "failed";
			}

			if(this.stopped){
				console.log("Executor.execute_plan : plan stopped");
				return "stopped";
			}
		}
		
		console.log("Executor.execute_plan : plan completed");
		
		this.currentPlan = undefined;
		this.stopped = true;
		return "completed";
	}

	/**
	 * @param {Plan} plan
	 */
	set_new_plan(plan){
		this.currentPlan = plan;
		this.to_be_executed = true;
	}

	stop_plan(){
		this.stopped = true;
		this.to_be_executed = false;
		this.currentPlan = undefined;
	}
}