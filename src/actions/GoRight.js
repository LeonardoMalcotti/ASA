import {MovementAction} from "./MovementAction.js";

export default class GoRight extends MovementAction {
	/**
	 *
	 * @param {Position} position
	 */
	constructor(position) {
		super();
		this.direction = "right"
		this.position_to_reach = position;
	}
}