/**
 *
 * @param {Date} old_time
 * @param {Date} current_time
 * @param {number} decadence_rate
 */
export function computeNewReward(old_time, current_time, decadence_rate){

}

/**
 * @template {*} T
 * @param {T[]} list
 * @param {T} element
 */
export function remove_from_list(list,element){
	if(! Array.isArray(list)){
		return;
	}

	let i = list.indexOf(element);
	if(i !== -1) {
		list.splice(i,1);
	}
}

/**
 * calculate the distance between the two positions in the case there are no walls.
 * @param {Position} from
 * @param {Position} to
 * @return {number}
 */
export function optimal_distance(from, to){
	return Math.abs(from.x - to.x) + Math.abs(from.y - from.y);
}

/**
 *
 * @param {Position} p1
 * @param {Position} p2
 */
export function same_position(p1, p2){
	return p1.y === p2.y && p1.x === p2.x;
}