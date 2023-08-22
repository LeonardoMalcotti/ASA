export default class Executor {
	/** @type {Plan} */
	currentPlan;
	/** @type {boolean} */
	stopped;
	/** @type {boolean} */
	to_be_executed;
	/** @type {DeliverooApi} */
	client;
	
	/** @type {BeliefSet} */
	beliefs;
	
	/**
	 * @type {("failed" | "stopped" | "completed" | "executing" | "new")}
	 */
	status;
	
	unicity_check = 0;
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 */
	constructor(client, beliefs) {
		this.beliefs = beliefs;
		this.currentPlan = undefined;
		this.stopped = true;
		this.to_be_executed = false;
		this.client = client;
		this.status = "stopped";
	}

	async execute_plan(){
		if(this.unicity_check > 0){
			throw "invalid";
		}
		
		if(this.to_be_executed === false){
			console.log("Executor.execute_plan : plan not to be executed yet");
			this.stopped = true;
			return "invalid";
		}

		if(this.currentPlan === undefined){
			console.log("Executor.execute_plan : no plan");
			this.stopped = true;
			this.to_be_executed = false;
			return "invalid";
		}
		
		this.to_be_executed = false;
		this.stopped = false;
		this.unicity_check ++;
		
		console.log("Executor.execute_plan " + this.unicity_check + " : executing plan");
		for(let action of this.currentPlan.actions){
			let retries = 3;
			
			if(this.stopped === true){
				console.log("Executor.execute_plan " + this.unicity_check + " : plan stopped");
				this.unicity_check --;
				throw "stopped";
			}
			
			let result = await action.execute(this.client);
			
			// retry the action max 3 times
			if(result === false) {
				console.log("Executor.execute_plan " + this.unicity_check + " : failed action " + action.constructor.name);
				while(retries > 0){
					
					if(this.stopped === true){
						console.log("Executor.execute_plan " + this.unicity_check + " : plan stopped");
						this.unicity_check--;
						throw "stopped";
					}
					
					result = await action.execute(this.client);
					
					if(result !== false) {
						retries = 0;
					} else {
						retries --;
					}
				}
				if(result === false) {
					this.currentPlan = undefined;
					this.stopped = true;
					console.log("Executor.execute_plan " + this.unicity_check + " : plan failed")
					this.unicity_check --;
					throw "failed";
				}
			}
			console.log("executed" + this.unicity_check + " : "+action.constructor.name);
			console.log(result);
		}
		
		console.log("Executor.execute_plan " + this.unicity_check + " : plan completed");
		
		this.currentPlan = undefined;
		this.stopped = true;
		this.unicity_check --;
		return "completed";
	}

	
	async action_loop() {
		while(true){
			if(this.currentPlan !== undefined && this.currentPlan.actions.length !== 0){
				this.status = "executing";
				let next_action = this.currentPlan.actions.shift();
				
				let result = await next_action.execute(this.client, this.beliefs);
				
				if(result === false){
					this.status = "failed";
					this.currentPlan = undefined;
					console.log("ActionLoop : failed action");
				} else {
					console.log("ActionLoop : executed action");
					if(this.currentPlan.actions.length === 0){
						this.status = "completed";
					}
				}
			} else {
				this.status = "stopped";
			}
			await new Promise( (r) => {setTimeout(r)} );
		}
	}
	
	
	/**
	 * @param {Plan} plan
	 */
	set_new_plan(plan){
		this.currentPlan = plan;
		this.to_be_executed = true;
	}

	async stop_plan(){
		console.log("Executor : stopping plan "+this.unicity_check);
		this.stopped = true;
		this.to_be_executed = false;
		this.currentPlan = undefined;
	}
	
	/**
	 * @param {Plan} plan
	 */
	set_new_plan2(plan){
		this.currentPlan = plan;
	}
	
	async stop_plan2(){
		this.currentPlan = undefined;
	}
}