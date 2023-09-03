import Executor from "./Executor.js";
import {MovementAction} from "../actions/MovementAction.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import {same_position} from "../utils/Utils.js";

import {path_to_actions} from "../planning/utils.js";
import {EXECUTOR_LOG} from "../../config.js";
import Plan from "../actions/Plan.js";
import Ask from "../actions/Ask.js";
import {endCollaboration} from "../communications/CollaborationUtils.js";

export default class ContinuousExecutor extends Executor{
	
	/**
	 * @param {BeliefSet} beliefs
	 */
	constructor(beliefs) {
		super(beliefs);
	}

	
	async action_loop(){
		while(this.abort === false){
			if(this.beliefs.currentPlan !== undefined && this.beliefs.currentPlan.actions.length !== 0){
				this.status = "executing";
				let next_action = this.beliefs.currentPlan.actions.shift();
				
				let result = await next_action.execute( this.beliefs);
				
				if(result === false || result === "No"){
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
							this.currentPlan = new Plan();
						}
					}
					
					if(next_action instanceof Ask){
						// try again
						let result = await next_action.execute( this.beliefs);
						if(result === false || result === "No"){
							if(EXECUTOR_LOG) console.log("ActionLoop : failed action again");
							this.status = "failed";
							await endCollaboration(this.beliefs);
							this.currentPlan = new Plan();
						}
					}
				} else {
					if(EXECUTOR_LOG) console.log("ActionLoop : executed " + next_action.constructor.name);
					if(this.beliefs.currentPlan.actions.length === 0){
						if(EXECUTOR_LOG) console.log("ActionLoop : plan completed ");
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
		
		if(EXECUTOR_LOG) console.log("Avoidance: from -> " + beliefs.my_position().description());
		if(EXECUTOR_LOG) console.log("Avoidance: to -> " +plan[0].position_to_reach.description());
		
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
		if(EXECUTOR_LOG) console.log("Avoidance: next action is not of movement type, change plan entirely.");
		return false;
	}
}