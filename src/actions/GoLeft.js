import {MovementAction} from "./MovementAction.js";

export default class GoLeft extends MovementAction {
	/**
	 *
	 * @param {Position} position
	 */
	constructor(position) {
		super();
		this.direction = "left"
		this.position_to_reach = position;
	}
}