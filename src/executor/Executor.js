export default class Executor {
	/** @type {Plan} */
	currentPlan;
	/** @type {DeliverooApi} */
	client;
	/** @type {BeliefSet} */
	beliefs;
	/** @type {("failed" | "stopped" | "completed" | "executing" | "new")} */
	status;
	
	/** @type {boolean} */
	abort;
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 */
	constructor(client, beliefs) {
		this.beliefs = beliefs;
		this.currentPlan = undefined;
		this.client = client;
		this.status = "stopped";
		this.abort = false;
	}
	
	async action_loop() {}
	
	
	/**
	 * @param {Plan} plan
	 */
	set_new_plan(plan){
		this.currentPlan = plan;
	}
	
	stop_plan(){
		this.currentPlan = undefined;
	}
	
	abort_execution(){
		this.abort = true;
	}
}