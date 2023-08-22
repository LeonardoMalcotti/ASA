import Plan from "../actions/Plan.js";
import GoPutDown from "../intentions/GoPutDown.js";
import GoPickUp from "../intentions/GoPickUp.js";
import {calculate_path} from "../utils/astar.js";
import GoUp from "../actions/GoUp.js";
import GoDown from "../actions/GoDown.js";
import GoRight from "../actions/GoRight.js";
import GoLeft from "../actions/GoLeft.js";
import PutDown from "../actions/PutDown.js";
import PickUp from "../actions/PickUp.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import calculate_random_path from "../utils/standard_path.js";

/**
 *
 * @param {BeliefSet} beliefs
 * @param {Intention} intention
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
		plan.actions.push(new PutDown(intention.parcels_id));
		/*console.log("my position" + beliefs.my_position());
		console.log("path-------");
		console.log(intention.possible_path);
		console.log("plan-------");
		console.log(plan);*/
	}

	if(intention instanceof GoPickUp) {
		console.log("plan_simple : planning a pick up");
		if(intention.possible_path === undefined){
			intention.possible_path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
		}

		path_to_actions(beliefs.my_position(),intention.possible_path).forEach((a) => {plan.actions.push(a)});
		plan.actions.push(new PickUp(intention.parcel_id));
		/*console.log("my position" + beliefs.my_position());
		console.log("path-------");
		console.log(intention.possible_path);
		console.log("plan-------");
		console.log(plan);*/
	}
	
	if(intention instanceof DefaultIntention || intention === undefined) {
		console.log("plan_simple : planning a default");
		let path = await calculate_random_path(beliefs);
		path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	}
	
	return plan;
}

/**
 * @param {Position} start
 * @param {Tile[]} path
 * @return {Action[]}
 */
function path_to_actions(start, path){
	let actions = [];
	let previous_position = start;

	for(let t of path){
		let next_position = t.toPosition();
		if(previous_position.y < next_position.y){
			actions.push(new GoUp());
		}
		if(previous_position.y > next_position.y){
			actions.push(new GoDown());
		}
		if(previous_position.x < next_position.x){
			actions.push(new GoRight());
		}
		if(previous_position.x > next_position.x){
			actions.push(new GoLeft());
		}

		previous_position = next_position;
	}

	return actions;
}