import Executor from "./Executor.js";
import {MovementAction} from "../actions/MovementAction.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import {same_position} from "../utils/Utils.js";

import {path_to_actions} from "../planning/utils.js";
import {EXECUTOR_LOG} from "../../config.js";

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
			if(this.beliefs.currentPlan !== undefined && this.beliefs.currentPlan.actions.length !== 0){
				this.status = "executing";
				let next_action = this.beliefs.currentPlan.actions.shift();
				
				let result = await next_action.execute(this.client, this.beliefs);
				
				if(result === false){
					if(EXECUTOR_LOG) console.log("ActionLoop : failed action");
					if (next_action instanceof MovementAction){
						if(EXECUTOR_LOG) console.log("ActionLoop : calculate avoidance path");
						let res = await avoid_obstacle(
							this.beliefs,
							next_action
						);
						
						if(res === false){
							if(EXECUTOR_LOG) console.log("ActionLoop : no avoidance path");
							this.status = "failed";
							this.currentPlan = undefined;
						}
					}
				} else {
					if(EXECUTOR_LOG) console.log("ActionLoop : executed action");
					if(this.currentPlan !== undefined &&
						this.beliefs.currentPlan.actions.length === 0){
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

/**
 * @param {BeliefSet} beliefs
 * @param {Plan} plan
 * @param {Action} failed_action
 */
async function avoid_obstacle(beliefs, failed_action){
	let plan = beliefs.currentPlan;
	
	if(plan.actions.length === 0) return false;
	
	if(plan[0] instanceof MovementAction){
		// find another path
		let path = await calculate_path_considering_nearby_agents(
			beliefs,
			beliefs.my_position(),
			plan[0].position_to_reach
		);
		
		if(path.length === 0){
			plan.actions = [];
			return false;
		}
		
		for(let p of path.map((x) => x).reverse()){
			if(plan.actions.length === 0) break;
			if(!same_position(plan[0].position_to_reach,p.toPosition())) break;
			plan.actions.shift();
		}
		
		let new_actions = path_to_actions(beliefs.my_position(),path);
		
		while(new_actions.length !== 0){
			plan.actions.unshift(new_actions.pop());
		}
		 return true;
	} else {
		return false;
	}
}