import {Intention} from "./Intention.js";

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
}