import Plan from "../actions/Plan.js";

export default class Executor {
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
		this.beliefs.currentPlan = plan;
	}
	
	stop_plan(){
		this.beliefs.currentPlan.actions = [];
	}
	
	abort_execution(){
		this.abort = true;
	}
}