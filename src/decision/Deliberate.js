import {optimal_distance} from "../utils/Utils.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import GoPickUp from "../intentions/GoPickUp.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import {DELIBERATE_LOG} from "../../config.js";
import BringTo from "../intentions/BringTo.js";

/**
 * A deliberate function should take as input the current beliefs and a list of intentions (desires)
 * and return an intention from the ones given, or a default intention in case there are no desires
 * or if after another filtering there are not available ones.
 */


/**
 * This will just sort by possible reward.
 * @param {BeliefSet} beliefs
 * @param {DesireSet} desires
 * @return {Promise<Intention>}
 */
export async function deliberate_simple(beliefs, desires) {
	if(DELIBERATE_LOG) console.log("deliberate_simple");
	if(desires.intentions.length === 0) return new DefaultIntention();
	desires.intentions.sort((i1,i2) => i1.possible_reward - i2.possible_reward);
	return desires.intentions.pop();
}

/**
 * The precise implementation of the deliberation function will compute all the shortest path for each pick up and put
 * down intentions, calculating so which one will give the most reward if completed, considering that for the pick up
 * intention it has also to calculate a possible put down.
 * @param {BeliefSet} beliefs
 * @param {DesireSet} desires
 * @return {Promise<Intention>}
 */
export async function deliberate_precise(beliefs, desires) {
	if(DELIBERATE_LOG) console.log("deliberate_precise");
	let res = await Promise.all(desires.intentions
		.map(async (i) => {
			if(i instanceof GoPickUp){
				let parcel = beliefs.getParcelBelief(i.parcel_id);
				let dist = await distance_to_the_nearest_delivery(beliefs, i.parcel_id);
				if(dist === -1) {
					i.possible_reward = -1;
				} else {
					i.possible_reward = parcel.reward_after_n_steps(beliefs, i.possible_path.length + dist);
				}
			}
			return i;
		}));
	
	res = res.filter((i) => i.possible_reward > 0);
	if(res.length === 0) return new DefaultIntention();
	
	// order the intentions from the one with the least possible reward to the most reward
	res = res.sort((i1,i2) => i1.possible_reward - i2.possible_reward);
	
	// get the reward from the best one
	let best_reward = res[res.length-1].possible_reward;
	
	// get only the intentions with the highest reward
	res = res.filter((i) => i.possible_reward === best_reward)
	
	// divide the bring to from the rest
	let bring_to_options = res.filter((i) => i instanceof BringTo);
	let other_options = res.filter((i) => !(i instanceof BringTo));
	
	// sort the rest by length of possible path
	other_options = other_options.sort((i1,i2) => i1.possible_path.length - i2.possible_path.length)
	
	// re-add the bring to otions to the total
	bring_to_options.forEach((o) => other_options.push(o));
	
	return  other_options.shift();
}


/**
 * Return the number of steps required to reach the nearest delivery tile, -1 if no path was found.
 * @param {BeliefSet} beliefs
 * @param {string} parcel_id
 * @param {boolean} heuristic
 */
async function distance_to_the_nearest_delivery(beliefs, parcel_id, heuristic = false){
	let parcel = beliefs.getParcelBelief(parcel_id);
	if(parcel === undefined) return -1;
	let min = Number.MAX_VALUE;

	for(let t of beliefs.mapBeliefs.delivery_tiles){
		let min_dist = optimal_distance(parcel.position,t.toPosition());
		let opt_reward = parcel.reward_after_n_steps(beliefs, min_dist);
		if( opt_reward <= 0){
			continue;
		}

		let possible_reward = 0;

		if(!heuristic){
			let possible_path = await calculate_path_considering_nearby_agents(beliefs,parcel.position,t.toPosition());
			if(possible_path.length === 0){
				continue;
			}

			possible_reward = parcel.reward_after_n_steps(beliefs, possible_path.length);
		} else {
			possible_reward = opt_reward;
		}

		if(possible_reward <= 0){
			continue;
		}

		if(possible_reward <= min){
			min = possible_reward;
		}
	}

	return min === Number.MAX_VALUE? -1 : min;
}