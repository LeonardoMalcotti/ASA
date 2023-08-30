import {Intention} from "./Intention.js";
import {optimal_distance} from "../utils/Utils.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import Ask from "../actions/Ask.js";

export default class BringTo extends Intention{
	/** @type {string[]} */
	parcels_id;
	/** @type {string} */
	ally_id;
	/** @type {Position} */
	position;
	/** @type {{parcel_id:string, possible_reward:number}[]} */
	possible_reward_per_parcel;
	
	/**
	 * @param {string[]} parcels_id
	 * @param {string} ally_id
	 */
	constructor(parcels_id, ally_id) {
		super();
		this.parcels_id = parcels_id;
		this.ally_id = ally_id;
		this.possible_reward_per_parcel = [];
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async achievable(beliefs) {
		if(this.status === "completed" || this.status === "failed" || this.status === "stopped") return false;
		this.position = beliefs.getAgentBelief(this.ally_id).position;
		let res = await Promise.all(this.parcels_id.map((id) => this.achievable_filter(beliefs,id)));
		this.parcels_id = this.parcels_id.filter((v,i) => res[i]);
		if(this.parcels_id.length === 0) return false;
		return await this.ask_availability(beliefs);
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async ask_availability(beliefs){
		let response = await (new Ask(this.ally_id,
			{
				topic: "Available?",
				token: beliefs.communication_token,
				msg_id: crypto.randomUUID(),
				cnt: {
					type: "BringTo",
					position: this.position,
					parcels : this.parcels_id
						.map((id) => beliefs.getParcelBelief(id))
						.filter((p) => p !== undefined)
						.map((p) => p.toParcelData()),
					possible_rewards : this.possible_reward_per_parcel
				}
			})).execute(beliefs);
		
		if(response === false) return false;
		if(response.final_possible_reward === undefined) return false;
		
		this.possible_reward = response.final_possible_reward;
		
		return true;
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
		
		if(parcel.reward_after_n_steps(beliefs, min_distance) <= 0) return false;
		
		if(this.possible_path === undefined){
			this.possible_path = await calculate_path_considering_nearby_agents(beliefs,beliefs.my_position(),this.position);
		}
		
		if(this.possible_path.length === 0) return false;
		
		let rw = parcel.reward_after_n_steps(beliefs, this.possible_path.length);
		if(rw <= 0) return false;
		
		this.possible_reward += rw;
		this.possible_reward_per_parcel.push({parcel_id: id, possible_reward: rw});
		
		return true;
	}
	
	description() {
		return this.constructor.name + " ally " + this.ally_id + " parcels [" + this.parcels_id.join(", ") + "]";
	}
	
	hash() {
		return this.constructor.name + "_" + this.ally_id + "_" + this.parcels_id.join("_");
	}
}