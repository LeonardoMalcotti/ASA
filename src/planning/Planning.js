import Plan from "../actions/Plan.js";
import GoPutDown from "../intentions/GoPutDown.js";
import GoPickUp from "../intentions/GoPickUp.js";
import {calculate_path} from "../utils/astar.js";
import PutDown from "../actions/PutDown.js";
import PickUp from "../actions/PickUp.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import calculate_random_path from "../utils/standard_path.js";
import {path_to_actions} from "./utils.js";

/**
 *
 * @param {BeliefSet} beliefs
 */
export async function plan_simple(beliefs) {
	let plan = new Plan();
	let intention = beliefs.currentIntention;
	
	if(intention instanceof GoPutDown) {
		console.log("plan_simple : planning a put down");
		if(intention.possible_path === undefined){
			intention.possible_path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
		}

		path_to_actions(beliefs.my_position(),intention.possible_path).forEach((a) => {plan.actions.push(a)});
		//plan.actions.push(new PutDown(intention.parcels_id));
		plan.actions.push(new PutDown()); // it would make sense to put down everything in this case
	}

	if(intention instanceof GoPickUp) {
		console.log("plan_simple : planning a pick up");
		if(intention.possible_path === undefined){
			intention.possible_path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
		}

		path_to_actions(beliefs.my_position(),intention.possible_path).forEach((a) => {plan.actions.push(a)});
		plan.actions.push(new PickUp());
	}
	
	if(intention instanceof DefaultIntention || intention === undefined) {
		console.log("plan_simple : planning a default");
		let path = await calculate_random_path(beliefs);
		path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	}
	
	return plan;
}

