import {Intention} from "./Intention.js";
import {optimal_distance} from "../utils/Utils.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import {reward_after_n_steps} from "../classes/ParcelBelief.js";

/**
 * @property {string[]} parcels_id
 * @property {Position} position
 */
export default class GoPutDown extends Intention {
	/** the list of parcels to put down.
	 * @type {string[]}
	 */
	parcels_id;
	/** the position on the map to leave the parcels.
	 * @type {Position}
	 */
	position;
	
	/**
	 *
	 * @param {string[]} parcels_id
	 * @param {Position} position
	 */
	constructor(parcels_id, position) {
		super();
		this.parcels_id = parcels_id;
		this.position = position;
	}
	
	description() {
		return this.constructor.name + " " +
			this.parcels_id + " in " +
			this.position.description() +
			" status " + this.status;
	}
	
	hash() {
		return this.constructor.name+"_"+this.parcels_id.join("_")+"_"+this.position.x+"_"+this.position.y;
	}
	
	/**
	 * Basically, for each parcel to put down, check if it is held by the agent, if it doesn't expire before being brought to destination.
	 * If it pass every check the calculated reward is added to the possible reward of the intention.
	 * If it does not, then it's removed from the list of parcel to deliver.
	 * If the list of parcel to deliver is empty the intention is considered unachievable.
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async achievable(beliefs) {
		if(this.status === "completed" || this.status === "failed" || this.status === "stopped") return false;
		let res = await Promise.all(this.parcels_id.map((id) => this.achievable_filter(beliefs,id)));
		this.parcels_id = this.parcels_id.filter((v,i) => res[i]);
		return this.parcels_id.length !== 0;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @param {string} id
	 * @return {Promise<boolean>}
	 */
	async achievable_filter(beliefs, id){
		let parcel = beliefs.getParcelBelief(id);
		
		if(parcel === undefined) return false;
		if(parcel.held_by !== beliefs.me.id) return false;
		
		let min_distance = optimal_distance(beliefs.my_position(), this.position);
		
		if(reward_after_n_steps(beliefs, parcel, min_distance) <= 0) return false;
		
		if(this.possible_path === undefined){
			this.possible_path = await calculate_path_considering_nearby_agents(beliefs,beliefs.my_position(),this.position);
		}
		
		if(this.possible_path === []) return false;
		
		let rw = reward_after_n_steps(beliefs, parcel, this.possible_path.length);
		if(rw <= 0) return false;
		
		this.possible_reward += rw;
		
		return true;
	}
}