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
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @param {Plan} plan
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs, plan){
		let res = await client.putdown(this.parcels_id);
		for(let p of res){
			beliefs.deleteParcelBeliefById(p.id);
		}
		//console.log("execute: PutDown");
		return res;
	}
}