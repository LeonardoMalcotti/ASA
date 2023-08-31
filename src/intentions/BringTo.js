import {optimal_distance} from "../utils/Utils.js";
import {calculate_path, calculate_path_considering_nearby_agents} from "../utils/astar.js";
import Ask from "../actions/Ask.js";
import {Collaboration} from "./Collaboration.js";
import ParcelBelief from "../classes/ParcelBelief.js";
import {askPosition} from "../communications/CollaborationUtils.js";
import Position from "../classes/Position.js";

export default class BringTo extends Collaboration{
	/** @type {string[]} */
	parcels_id;
	/** @type {Position} */
	position;
	/** @type {{parcel_id:string, possible_reward:number}[]} */
	possible_reward_per_parcel;
	
	/**
	 * @param {string[]} parcels_id
	 * @param {string} ally_id
	 */
	constructor(parcels_id, ally_id) {
		super(ally_id);
		this.parcels_id = parcels_id;
		this.possible_reward_per_parcel = [];
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<boolean>}
	 */
	async achievable(beliefs) {
		if(this.status === "completed" || this.status === "failed" || this.status === "stopped") return false;
		let agent = beliefs.getAgentBelief(this.ally);
		if(agent === undefined){
			let res = await askPosition(beliefs,this.ally);
			if(res === undefined || res === false) return false;
			this.position = new Position(res.x,res.y);
		} else {
			this.position = agent.position;
		}
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
		let response = await (new Ask(this.ally,
			{
				topic: "Available?",
				token: beliefs.communication_token,
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
		if(response.res === "No") return false;
		
		this.possible_reward = response.final_reward;
		
		return true;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @param {Position} position
	 * @param {ParcelData[]} parcels
	 * @param {{parcel_id: string, possible_reward: number}[]} possible_rewards
	 * @return {Promise<number>}
	 */
	static async check_availability(beliefs, position, parcels, possible_rewards){
		/** @type {{delivery: any, distance: number}[]} */
		let deliveries = await Promise.all(beliefs.mapBeliefs.delivery_tiles.map( async (d) => {
			let distance = await calculate_path_considering_nearby_agents(beliefs, beliefs.my_position(), d.toPosition());
			return {delivery: d, distance: distance.length};
		}))
		
		let nearest_delivery = deliveries
			.filter((o) => o.distance > 0)
			.sort((d1,d2) => d1.distance - d2.distance).shift();

		if(nearest_delivery === undefined){
			return -1;
		}
		
		return parcels
			.map((b) => ParcelBelief.fromParcelData(b))
			.map((b) => {
				b.reward = possible_rewards.find((r) => r.parcel_id === b.id).possible_reward;
				b.reward = b.reward_after_n_steps(beliefs, nearest_delivery.distance);
				return b;
			})
			.filter((b) => b.reward > 0)
			.reduce((acc, crr) => acc + crr.reward, 0);
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
			this.possible_path = await calculate_path(beliefs,beliefs.my_position(),this.position);
		}
		
		if(this.possible_path.length === 0) return false;
		
		let rw = parcel.reward_after_n_steps(beliefs, this.possible_path.length);
		if(rw <= 0) return false;
		
		this.possible_reward += rw;
		this.possible_reward_per_parcel.push({parcel_id: id, possible_reward: rw});
		
		return true;
	}
	
	description() {
		return this.constructor.name + " ally " + this.ally + " parcels [" + this.parcels_id.join(", ") + "]";
	}
	
	hash() {
		return this.constructor.name + "_" + this.ally + "_" + this.parcels_id.join("_");
	}
}