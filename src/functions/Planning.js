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

/**
 *
 * @param {BeliefSet} beliefs
 * @param {Intention} intention
 * @return {Plan}
 */
export function plan_simple(beliefs, intention) {
	let plan = new Plan();

	if(intention instanceof GoPutDown) {
		if(intention.possible_path === undefined){
			intention.possible_path = calculate_path(beliefs,beliefs.my_position(),intention.position);
		}

		plan.addAction(path_to_actions(beliefs.my_position(),intention.possible_path));
		plan.addAction(new PutDown(intention.parcels_id));
	}

	if(intention instanceof GoPickUp) {
		if(intention.possible_path === undefined){
			intention.possible_path = calculate_path(beliefs,beliefs.my_position(),intention.position);
		}

		plan.addAction(path_to_actions(beliefs.my_position(),intention.possible_path));
		plan.addAction(new PickUp(intention.parcels_id));
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