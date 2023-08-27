import Plan from "../actions/Plan.js";
import PDDLDomain from "../PDDLClasses/PDDLDomain.js";
import PDDLStatement from "../PDDLClasses/PDDLStatement.js";
import PDDLVariable from "../PDDLClasses/PDDLVariable.js";
import PDDLAction from "../PDDLClasses/PDDLAction.js";
import PDDLCondition from "../PDDLClasses/PDDLCondition.js";
import PDDLProblem from "../PDDLClasses/PDDLProblem.js";
import GoPutDown from "../intentions/GoPutDown.js";
import {path_to_actions} from "./utils.js";
import PutDown from "../actions/PutDown.js";
import GoPickUp from "../intentions/GoPickUp.js";
import PickUp from "../actions/PickUp.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import calculate_random_path from "../utils/standard_path.js";
import {onlineSolver} from "@unitn-asa/pddl-client";
import GoLeft from "../actions/GoLeft.js";
import Position from "../classes/Position.js";
import GoRight from "../actions/GoRight.js";
import GoUp from "../actions/GoUp.js";
import GoDown from "../actions/GoDown.js";

const tile1_var = new PDDLVariable("t1","tile");
const tile2_var = new PDDLVariable("t2","tile");
const parcel_var = new PDDLVariable("p", "parcel");

//const is_tile_statement = new PDDLStatement("tile",[tile1_var]);

const is_adiacent = new PDDLStatement("adiacent", [tile1_var,tile2_var]);

const is_carrying = new PDDLStatement("carrying", [parcel_var]);
const is_at = new PDDLStatement("at", [tile1_var]);
const parcel_at = new PDDLStatement("parcel_at", [parcel_var,tile1_var]);

//const is_delivery = new PDDLStatement("delivery",[tile1_var]);

const go_to = new PDDLAction(
	"go_to",
	[tile1_var,tile2_var],
	new PDDLCondition([
		is_at.with([tile1_var]),
		new PDDLCondition([
			is_adiacent.with([tile2_var,tile1_var]),
			is_adiacent.with([tile1_var,tile2_var])
		], true)
	]),
	new PDDLCondition([
		is_at.with([tile1_var]).not(),
		is_at.with([tile2_var])
	])
);

const pick_up = new PDDLAction(
	"pick_up",
	[parcel_var,tile1_var],
	new PDDLCondition([
		is_at.with([tile1_var]),
		parcel_at.with([parcel_var, tile1_var]),
		is_carrying.with([parcel_var]).not()
	]),
	new PDDLCondition([
		parcel_at.with([parcel_var,tile1_var]).not(),
		is_carrying.with([parcel_var])
	])
);

const put_down = new PDDLAction(
	"put_down",
	[parcel_var,tile1_var],
	new PDDLCondition([
		is_at.with([tile1_var]),
		is_carrying.with([parcel_var])
	]),
	new PDDLCondition([
		parcel_at.with([parcel_var, tile1_var]),
		is_carrying.with([parcel_var]).not()
	])
);

const domain = new PDDLDomain(
	"deliveroo",
	[
		is_adiacent,
		is_at, parcel_at, is_carrying
	],
	[
		go_to,
		pick_up, put_down
	],
	["tile", "parcel"]
);

/**
 *
 * @param {BeliefSet} beliefs
 */
export default async function plan_pddl_2(beliefs){
	let plan = new Plan();
	let intention = beliefs.currentIntention;
	
	let init = map_to_statements(beliefs.mapBeliefs.tiles);
	init.push(is_at.with([beliefs.my_position().hash()]));
	
	if(intention instanceof GoPutDown) {
		console.log("plan_pddl : planning a put down");
		let delivery = intention.position.hash();
		let goal = [];
		
		intention.parcels_id.forEach((p) => {
			init.push(is_carrying.with([p]));
			goal.push(parcel_at.with([p,delivery]));
		});
		
		let problem = new PDDLProblem(
			"goputdown",
			domain,
			init,
			new PDDLCondition(goal)
		);
		
		console.log(domain.toPddlString());
		console.log(problem.toPddlString());
		
		let pddl_actions = await onlineSolver(
			domain.toPddlString(),
			problem.toPddlString()
		);
		
		pddl_actions_to_plan_actions(pddl_actions).forEach((a) => {plan.actions.push(a)});
	}
	
	if(intention instanceof GoPickUp) {
		console.log("plan_pddl : planning a pick up");
		let position = intention.position.hash();
		let goal = [];
		
		init.push(parcel_at.with([intention.parcel_id,position]));
		goal.push(is_carrying.with([intention.parcel_id]));
		
		let problem = new PDDLProblem(
			"gopickup",
			domain,
			init,
			new PDDLCondition(goal)
		);
		
		console.log(domain.toPddlString());
		console.log(problem.toPddlString());
		
		let pddl_actions = await onlineSolver(
			domain.toPddlString(),
			problem.toPddlString()
		);
		
		pddl_actions_to_plan_actions(pddl_actions).forEach((a) => {plan.actions.push(a)});
	}
	
	if(intention instanceof DefaultIntention || intention === undefined) {
		console.log("plan_pddl : planning a default");
		let path = await calculate_random_path(beliefs);
		path_to_actions(beliefs.my_position(),path).forEach((a) => {plan.actions.push(a)});
	}
	
	return plan;
}

/**
 * @param {Tile[]} tiles
 */
function map_to_statements(tiles){
	/** @type {PDDLStatement[]} */
	let statements = [];
	
	for (let tile of tiles){
		//left x -1
		let tmp_t = tiles.find((t) => t.x === (tile.x - 1) && t.y === tile.y)
		if (tmp_t !== undefined &&
			!statements.find((s) => s.parameters.every((value) => value === tmp_t.hash() || value === tile.hash()))){
			statements.push(is_adiacent.with([tmp_t.hash(),tile.hash()]));
		}
		
		tmp_t = tiles.find((t) => t.x === (tile.x + 1) && t.y === tile.y)
		if(tmp_t !== undefined &&
			!statements.find((s) => s.parameters.every((value) => value === tmp_t.hash() || value === tile.hash()))){
			statements.push(is_adiacent.with([tmp_t.hash(),tile.hash()]));
		}
		
		tmp_t = tiles.find((t) => t.x === tile.x && t.y === (tile.y - 1))
		if(tmp_t !== undefined &&
			!statements.find((s) => s.parameters.every((value) => value === tmp_t.hash() || value === tile.hash()))){
			statements.push(is_adiacent.with([tmp_t.hash(),tile.hash()]));
		}
		
		tmp_t = tiles.find((t) => t.x === tile.x && t.y === (tile.y + 1))
		if(tmp_t !== undefined &&
			!statements.find((s) => s.parameters.every((value) => value === tmp_t.hash() || value === tile.hash()))){
			statements.push(is_adiacent.with([tmp_t.hash(),tile.hash()]));
		}
	}
	
	return statements;
}

/**
 *
 * @param {{parallel:boolean,action:string,args:string[]}[]} pddl_actions
 */
function pddl_actions_to_plan_actions(pddl_actions){
	/** @type {Action[]} */
	let ret = [];
	
	for(let pa of pddl_actions){
		switch (pa.action) {
			case "go_to" : {
				let from = Position.fromHash(pa.args[0]);
				let to = Position.fromHash(pa.args[1]);
				
				if(from.x - 1 === to.x && from.y === to.y){
					ret.push(new GoLeft(Position.fromHash(pa.args[1])));
				}
				
				if(from.x + 1 === to.x && from.y === to.y){
					ret.push(new GoRight(Position.fromHash(pa.args[1])));
				}
				
				if(from.x === to.x && from.y - 1 === to.y){
					ret.push(new GoDown(Position.fromHash(pa.args[1])));
				}
				
				if(from.x === to.x && from.y + 1 === to.y){
					ret.push(new GoUp(Position.fromHash(pa.args[1])));
				}
				break;
			}
			case "pick_up" : {
				ret.push(new PickUp(pa.args[0]));
				break;
			}
			case "put_down" : {
				ret.push(new PutDown([pa.args[0]]));
				break;
			}
		}
	}
	
	return ret;
}


