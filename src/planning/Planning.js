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
import {
	endCollaborationAction,
	goPickUpAction,
	startCollaborationAction
} from "../communications/CollaborationUtils.js";
import Position from "../classes/Position.js";
import {same_position} from "../utils/Utils.js";

/**
 *
 * @param {BeliefSet} beliefs
 */
export async function plan_simple(beliefs) {
	let plan = new Plan();
	let intention = beliefs.currentIntention;
	
	if(intention instanceof GoPutDown) {
		await plan_go_put_down(beliefs,intention,plan);
	}

	if(intention instanceof GoPickUp) {
		await plan_go_pick_up(beliefs,intention,plan);
	}
	
	if(intention instanceof DefaultIntention || intention === undefined) {
		await plan_default(beliefs,plan);
	}
	
	if(intention instanceof DiscoverAlly){
		await plan_discover_ally(beliefs,plan);
	}
	
	if(intention instanceof BringTo){
		await plan_bring_to(beliefs,intention,plan);
	}
	
	return plan;
}

/**
 * @param {BeliefSet} beliefs
 * @param {GoPickUp} intention
 * @param {Plan} plan
 * @return {Promise<void>}
 */
export async function plan_go_pick_up(beliefs, intention,  plan){
	if(PLANNING_LOG) console.log("plan_simple : planning a pick up");
	let path = intention.possible_path;
	if (path === undefined){
		path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
	}
	
	path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	plan.actions.push(new PickUp());
}

/**
 * @param {BeliefSet} beliefs
 * @param {GoPutDown} intention
 * @param {Plan} plan
 * @return {Promise<void>}
 */
export async function plan_go_put_down(beliefs, intention, plan){
	if(PLANNING_LOG) console.log("plan_simple : planning a put down");
	let path = intention.possible_path;
	if (path === undefined){
		path = await calculate_path(beliefs, beliefs.my_position(), intention.position);
	}
	
	path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	//plan.actions.push(new PutDown(intention.parcels_id));
	plan.actions.push(new PutDown()); // it would make sense to put down everything in this case
}

/**
 * @param {BeliefSet} beliefs
 * @param {Plan} plan
 * @return {Promise<void>}
 */
export async function plan_default(beliefs,plan){
	if(PLANNING_LOG) console.log("plan_simple : planning a default");
	let path = await calculate_random_path(beliefs);
	path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
}

/**
 * @param {BeliefSet} beliefs
 * @param {Plan} plan
 * @return {Promise<void>}
 */
export async function plan_discover_ally(beliefs, plan){
	if(PLANNING_LOG) console.log("plan_simple : planning a discover ally");
	plan.actions.push(new Shout({
		topic : "Ally?",
		cnt : undefined,
		token : undefined
	}));
}

/**
 * @param {BeliefSet} beliefs
 * @param {BringTo} intention
 * @param {Plan} plan
 * @return {Promise<void>}
 */
export async function plan_bring_to(beliefs, intention, plan){
	if(PLANNING_LOG) console.log("plan_simple : planning a bring to");
	
	let start  = startCollaborationAction(beliefs,intention.ally);
	
	let path = await calculate_path(beliefs,beliefs.my_position(),intention.position);
	path.pop(); // to check
	let moving_actions = path_to_actions(beliefs.my_position(),path);
	let put_down = new PutDown(intention.parcels_id);
	path.reverse();
	let current_position = path.length === 0 ? beliefs.my_position() : path[0].toPosition();
	let current_tile = beliefs.mapBeliefs.tiles.find((t) => same_position(t.toPosition(),current_position));
	let possible_tiles = beliefs.mapBeliefs
		.neighbors(current_tile)
		.filter((t) => beliefs.agentBeliefs.some((a) => same_position(a.position,t.toPosition())) === false);
	if(possible_tiles.length === 0){
		console.log("Agent stuck");
		return ;
	}
	let go_back = path_to_actions(current_position, [possible_tiles[0]]);
	
	let go_pick_up = goPickUpAction(beliefs,intention.ally,intention.parcels_id[0], intention.position);
	
	let end  = endCollaborationAction(beliefs,intention.ally);
	
	
	plan.actions.push(start);
	moving_actions.forEach((a) => plan.actions.push(a));
	plan.actions.push(put_down);
	go_back.forEach((a) => plan.actions.push(a));
	plan.actions.push(go_pick_up);
	plan.actions.push(end);
}
