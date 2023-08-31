import GoUp from "../actions/GoUp.js";
import GoDown from "../actions/GoDown.js";
import GoRight from "../actions/GoRight.js";
import GoLeft from "../actions/GoLeft.js";
import Position from "../classes/Position.js";

/**
 * @param {Position} start
 * @param {Tile[]} path
 * @return {Action[]}
 */
export function path_to_actions(start, path) {
	let actions = [];
	let previous_position = start;
	console.log(path);
	for (let t of path) {
		let next_position = new Position(t.x, t.y);
		if (previous_position.y < next_position.y) {
			actions.push(new GoUp(next_position));
		}
		if (previous_position.y > next_position.y) {
			actions.push(new GoDown(next_position));
		}
		if (previous_position.x < next_position.x) {
			actions.push(new GoRight(next_position));
		}
		if (previous_position.x > next_position.x) {
			actions.push(new GoLeft(next_position));
		}
		
		previous_position = next_position;
	}
	
	return actions;
}