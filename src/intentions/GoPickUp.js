import {Intention} from "./Intention.js";
import {optimal_distance, same_position} from "../utils/Utils.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";

/**
 * @property {string} parcel_id the id of the parcel to pickup.
 * @property {Position} postition the position on the map to reach.
 */
export default class GoPickUp extends Intention{
	/** the id of the parcel to pickup.
	 *  @type {string}
	 */
	parcel_id;
	/** the position on the map to reach.
	 *  @type {Position}
	 */
	position;

	/**
	 * @param {string} parcel_id
	 * @param {Position} position
	 */
	constructor(parcel_id, position) {
		super();
		this.parcel_id = parcel_id;
		this.position = position;
	}
	
	description() {
		return this.constructor.name + " " + this.parcel_id + " in " + this.position.description() + " status " + this.status;
	}
	
	
	hash() {
		return this.constructor.name+"_"+ this.parcel_id;
	}
	
	/**
	 *
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async achievable(beliefs) {
		if(this.status === "completed" || this.status === "failed" || this.status === "stopped") return false;
		
		let parcel = beliefs.getParcelBelief(this.parcel_id);
		
		if(parcel === undefined) return false;
		if (parcel.held_by !== null) return false;
		
		let min_distance = optimal_distance(beliefs.my_position(), this.position);
		if (parcel.reward_after_n_steps(beliefs, min_distance) <= 0) return false;

		this.possible_path = await calculate_path_considering_nearby_agents(beliefs, beliefs.my_position(), parcel.position);

		if (this.possible_path.length === 0) return false;
		
		if(beliefs.agentBeliefs.some((a) => same_position(a.position,parcel.position))) return false;
		
		this.possible_reward = parcel.reward_after_n_steps(beliefs, this.possible_path.length);
		return this.possible_reward > 0;
	}
}