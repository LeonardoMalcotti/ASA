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