import {MovementAction} from "./MovementAction.js";

export default class GoUp extends MovementAction {
	/**
	 *
	 * @param {Position} position
	 */
	constructor(position) {
		super();
		this.direction = "up"
		this.position_to_reach = position;
	}
}