import Action from "./Action.js";
import {same_position} from "../utils/Utils.js";
import PickUp from "./PickUp.js";

export class MovementAction extends Action{
	/** @type {string} */
	direction;
	/** @type {Position} */
	position_to_reach;
	
	constructor() {
		super();
		this.direction = "None";
		this.position_to_reach = undefined;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(beliefs){
		let new_position = await beliefs.client.move(this.direction);
		await this.pick_parcel_on_the_way(beliefs,new_position);
		return new_position;
	}
	
	/**
	 * this will check if the agent steps on a parcel that it didn't plan to pick up
	 * if the parcel is available, and it would not expire at the end of the current plan
	 * it picks it up
	 * @param beliefs
	 * @param new_position
	 * @return {Promise<void>}
	 */
	async pick_parcel_on_the_way(beliefs, new_position){
		let plan = beliefs.currentPlan;
		
		if(new_position !== "false" && !(plan.nextAction() instanceof PickUp)){
			if(beliefs.parcelBeliefs.filter((p) =>
				p.held_by === null &&
				same_position(p.position,new_position) &&
				p.reward_after_n_steps(beliefs,plan.actions.length) > 0).length !== 0)
			{
				plan.actions.unshift(new PickUp());
			}
		}
	}
}