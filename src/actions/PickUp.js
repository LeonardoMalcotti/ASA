import Action from "./Action.js";
import Ask from "./Ask.js";

export default class PickUp extends Action {
	/**
	 * @param {string} parcel_id
	 */
	constructor() {
		super();
	}
	
	/**
	 * @param {BeliefSet} beliefs
	 * @return {Promise<integer[]>}
	 */
	async execute(beliefs){
		let res = await beliefs.client.pickup();
		for(let p of res){
			let b = beliefs.getParcelBelief(p.toString());
			if(b !== undefined){
				b.held_by = beliefs.me.id;
			}
		}
		//console.log("execute: PickUp");
		return res;
	}
}