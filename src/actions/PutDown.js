import Action from "./Action.js";

export default class PutDown extends Action {
	/** @type {string[]} */
	parcels_id;

	/**
	 * @param {string[]} parcels_id
	 */
	constructor(parcels_id) {
		super();
		this.parcels_id = parcels_id;
	}
}