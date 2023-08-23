import Executor from "./Executor.js";

export default class ContinuousExecutor extends Executor{
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 */
	constructor(client, beliefs) {
		super(client, beliefs);
	}

	
	async action_loop(){
		while(this.abort === false){
			if(this.currentPlan !== undefined && this.currentPlan.actions.length !== 0){
				this.status = "executing";
				let next_action = this.currentPlan.actions.shift();
				
				let result = await next_action.execute(this.client, this.beliefs, this.currentPlan);
				
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
}