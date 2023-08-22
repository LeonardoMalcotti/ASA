import Action from "./Action.js";

export default class PickUp extends Action {
	/** @type {string} */
	parcel_id;

	/**
	 * @param {string} parcel_id
	 */
	constructor(parcel_id) {
		super();
		this.parcel_id = parcel_id;
	}
	
	/**
	 * @param {DeliverooApi} client
	 * @param {BeliefSet} beliefs
	 * @return {Promise<{x: number, y: number} | "false">}
	 */
	async execute(client, beliefs){
		//console.log("execute: PickUp");
		return client.pickup();
	}
}