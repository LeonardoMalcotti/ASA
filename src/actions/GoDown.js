import {MovementAction} from "./MovementAction.js";

export default class GoDown extends MovementAction {
	/**
	 *
	 * @param {Position} position
	 */
	constructor(position) {
		super();
		this.direction = "down"
		this.position_to_reach = position;
	}
}