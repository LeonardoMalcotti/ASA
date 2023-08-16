import {Intention} from "./Intention.js";
import {optimal_distance} from "../utils/Utils.js";
import {calculate_path} from "../utils/astar.js";

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
	 *
	 * @param {string} parcel_id
	 * @param {Position} position
	 */
	constructor(parcel_id, position) {
		super();
		this.parcel_id = parcel_id;
		this.position = position;
	}

	/**
	 *
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async achievable(beliefs) {
		let parcel = beliefs.getParcelBelief(this.parcel_id);
		if(parcel === undefined) {
			return false;
		}

		if (parcel.held_by !== "") {
			return false;
		}

		let min_distance = optimal_distance(beliefs.my_position(), this.position);
		if (parcel.reward_after_n_steps(beliefs, min_distance) <= 0) {
			return false;
		}

		this.possible_path = await calculate_path(beliefs, beliefs.my_position(), this.position);

		if (this.possible_path === []) {
			return false;
		}

		this.possible_reward = parcel.reward_after_n_steps(beliefs, this.possible_path.length);
		if (this.possible_reward <= 0) {
			return false;
		}

		return true;
	}
}