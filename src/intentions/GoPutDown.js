import {Intention} from "./Intention.js";
import {optimal_distance} from "../utils/Utils.js";
import {calculate_path} from "../utils/astar.js";

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

	/**
	 * Basically, for each parcel to put down, check if it is held by the agent, if it doesn't expire before being brought to destination.
	 * If it pass every check the calculated reward is added to the possible reward of the intention.
	 * If it does not, then it's removed from the list of parcel to deliver.
	 * If the list of parcel to deliver is empty the intention is considered unachievable.
	 * @param {BeliefSet} beliefs
	 * @return {Boolean}
	 */
	achievable(beliefs) {

		this.parcels_id = this.parcels_id.filter((id) => {
			let parcel = beliefs.getParcelBelief(id);

			if(parcel.held_by !== beliefs.me.id){
				return false;
			}

			let min_distance = optimal_distance(beliefs.my_position(), this.position);

			if(parcel.reward_after_n_steps(beliefs, min_distance) <= 0){
				return false;
			}

			if(this.possible_path === undefined){
				this.possible_path = calculate_path(beliefs,beliefs.my_position(),this.position);
			}

			if(this.possible_path === []){
				return false;
			}

			let rw = parcel.reward_after_n_steps(beliefs, this.possible_path.length);
			if(rw <= 0){
				return false;
			}

			this.possible_reward += rw;

			return true;
		});

		return this.parcels_id !== [];
	}
}