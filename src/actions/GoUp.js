import Action from "./Action.js";
import PickUp from "./PickUp.js";
import {same_position} from "../utils/Utils.js";

export default class GoUp extends Action {
	constructor() {
		super();
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @param {Plan} plan
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs, plan){
		let new_position = await client.move("up");
		
		// this will check if the agent steps on a parcel that it didn't plan to pick up
		// if the parcel is available, and it would not expire at the end of the current plan
		// it picks it up
		if(new_position !== "false" && !(plan.nextAction() instanceof PickUp)){
			if(beliefs.parcelBeliefs.filter((p) =>
				p.held_by === null &&
				same_position(p.position,new_position) &&
				p.reward_after_n_steps(beliefs,plan.actions.length) > 0).length !== 0)
			{
				plan.actions.unshift(new PickUp());
			}
		}
		
		return new_position;
	}
}