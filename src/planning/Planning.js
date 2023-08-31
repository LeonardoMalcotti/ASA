import Plan from "../actions/Plan.js";
import GoPutDown from "../intentions/GoPutDown.js";
import GoPickUp from "../intentions/GoPickUp.js";
import {calculate_path} from "../utils/astar.js";
import PutDown from "../actions/PutDown.js";
import PickUp from "../actions/PickUp.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import calculate_random_path from "../utils/standard_path.js";
import {path_to_actions} from "./utils.js";
import {PLANNING_LOG} from "../../config.js";
import Shout from "../actions/Shout.js";
import Ask from "../actions/Ask.js";
import DiscoverAlly from "../intentions/DiscoverAlly.js";
import BringTo from "../intentions/BringTo.js";
import Say from "../actions/Say.js";

/**
 *
 * @param {BeliefSet} beliefs
 */
export async function plan_simple(beliefs) {
	let plan = new Plan();
	let intention = beliefs.currentIntention;
	
	if(intention instanceof GoPutDown) {
		if(PLANNING_LOG) console.log("plan_simple : planning a put down");
		if(intention.possible_path === undefined){
			intention.possible_path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
		}

		path_to_actions(beliefs.my_position(),intention.possible_path).forEach((a) => {plan.actions.push(a)});
		//plan.actions.push(new PutDown(intention.parcels_id));
		plan.actions.push(new PutDown()); // it would make sense to put down everything in this case
	}

	if(intention instanceof GoPickUp) {
		if(PLANNING_LOG) console.log("plan_simple : planning a pick up");
		if(intention.possible_path === undefined){
			intention.possible_path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
		}

		path_to_actions(beliefs.my_position(),intention.possible_path).forEach((a) => {plan.actions.push(a)});
		plan.actions.push(new PickUp());
	}
	
	if(intention instanceof DefaultIntention || intention === undefined) {
		if(PLANNING_LOG) console.log("plan_simple : planning a default");
		let path = await calculate_random_path(beliefs);
		path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	}
	
	if(intention instanceof DiscoverAlly){
		if(PLANNING_LOG) console.log("plan_pddl : planning a discover ally");
		plan.actions.push(new Shout({
			topic : "Ally?",
			cnt : undefined,
			token : undefined
		}));
	}
	
	if(intention instanceof BringTo){
		if(PLANNING_LOG) console.log("plan_pddl : planning a bring to");
		let start  = new Say(intention.ally,
			{
				topic: "WaitIn",
				token: beliefs.communication_token,
				cnt: {
					waiting_position: intention.position
				}
			});
		
		let path = await calculate_path(beliefs,beliefs.my_position(),intention.position);
		path.pop();
		
		let moving_actions = path_to_actions(beliefs.my_position(),path);
		let put_down = new PutDown(intention.parcels_id);
		path.reverse();
		let go_back = path_to_actions(path[0].toPosition(), [path[0], path[1],path[2],path[3]]);
		
		let end  = new Say(intention.ally,
			{
				topic: "EndCollaboration",
				token: beliefs.communication_token
			});
		
		
		plan.actions.push(start);
		moving_actions.forEach((a) => plan.actions.push(a));
		plan.actions.push(put_down);
		go_back.forEach((a) => plan.actions.push(a));
		plan.actions.push(end);
	}
	
	return plan;
}


/**
 *
 * @param {BeliefSet} beliefs
 */
export async function only_ask(beliefs){
	let plan = new Plan();
	
	while(plan.actions.length < 10){
		plan.actions.push(new Shout({cnt : "some"}));
	}
	
	return plan;
}


/**
 *
 * @param {BeliefSet} beliefs
 */
export async function do_nothing(beliefs){
	let plan = new Plan();
	return plan;
}

