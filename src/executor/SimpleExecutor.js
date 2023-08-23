import Executor from "./Executor.js";

export default class SimpleExecutor extends Executor{
	
	/** @type {boolean} */
	stopped;
	/** @type {boolean} */
	to_be_executed;
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 */
	constructor(client, beliefs) {
		super(client, beliefs);
		this.stopped = true;
		this.to_be_executed = false;
	}
	
	async action_loop(){
		if(this.to_be_executed === false){
			console.log("SimpleExecutor.execute_plan : plan not to be executed yet");
			this.stopped = true;
			return "invalid";
		}
		
		if(this.currentPlan === undefined){
			console.log("SimpleExecutor.execute_plan : no plan");
			this.stopped = true;
			this.to_be_executed = false;
			return "invalid";
		}
		
		this.to_be_executed = false;
		this.stopped = false;
		
		console.log("SimpleExecutor.execute_plan : executing plan");
		for(let action of this.currentPlan.actions){
			let retries = 3;
			
			if(this.stopped === true){
				console.log("SimpleExecutor.execute_plan : plan stopped");
				throw "stopped";
			}
			
			let result = await action.execute(this.client,this.beliefs);
			
			// retry the action max 3 times
			if(result === false) {
				console.log("SimpleExecutor.execute_plan : failed action " + action.constructor.name);
				while(retries > 0){
					
					if(this.stopped === true){
						console.log("SimpleExecutor.execute_plan : plan stopped");
						throw "stopped";
					}
					
					result = await action.execute(this.client,this.beliefs);
					
					if(result !== false) {
						retries = 0;
					} else {
						retries --;
					}
				}
				if(result === false) {
					this.currentPlan = undefined;
					this.stopped = true;
					console.log("SimpleExecutor.execute_plan : plan failed")
					this.unicity_check --;
					throw "failed";
				}
			}
			console.log("executed : "+action.constructor.name);
			console.log(result);
		}
		
		console.log("SimpleExecutor.execute_plan : plan completed");
		
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