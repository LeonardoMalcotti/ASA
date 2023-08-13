import {Intention} from "./Intention.js";

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
}