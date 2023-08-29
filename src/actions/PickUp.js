import Action from "./Action.js";

export default class PickUp extends Action {
	/**
	 * @param {string} parcel_id
	 */
	constructor() {
		super();
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs){
		let res = await client.pickup();
		for(let p of res){
			let b = beliefs.getParcelBelief(p);
			if(b !== undefined){
				b.held_by = beliefs.me.id;
			}
		}
		//console.log("execute: PickUp");
		return client.pickup();
	}
}