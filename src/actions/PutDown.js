import Action from "./Action.js";

export default class PutDown extends Action {
	/** @type {string[]} */
	parcels_id;

	/**
	 * @param {string[]} parcels_id
	 */
	constructor(parcels_id = undefined) {
		super();
		this.parcels_id = parcels_id;
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<integer[]>}
	 */
	async execute(beliefs){
		let res = await beliefs.client.putdown(this.parcels_id);
		for(let p of res){
			beliefs.deleteParcelBeliefById(p.toString());
		}
		return res;
	}
}