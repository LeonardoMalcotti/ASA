import DesireSet from "../classes/DesireSet.js";
import GoPickUp from "../intentions/GoPickUp.js";
import GoPutDown from "../intentions/GoPutDown.js";
import {GENERATION_LOG} from "../../config.js";

/**
 *
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @return {DesireSet}
 */
export function optionsGeneration_simple(beliefs)  {
	if(GENERATION_LOG) console.log("optionsGeneration_simple");
	let free_parcels = beliefs.parcelBeliefs.filter((p) => p.held_by === null);
	let held_parcels = beliefs.parcelBeliefs.filter((p) => p.held_by === beliefs.me.id);
	//if(GENERATION_LOG) console.log("optionsGeneration_simple : free_parcels -> " + free_parcels.length);
	//if(GENERATION_LOG) console.log("optionsGeneration_simple : held_parcels -> " + held_parcels.length);
	
	// should get also the allied agents from the beliefs to create intentions that create a team plan

	let desires = new DesireSet();

	// generate go pick up intentions for each free parcel
	free_parcels.forEach((p) => desires.add_intention(new GoPickUp(p.id,p.position)));

	// generate go put down intentions for each delivery tile
	let held_parcels_ids = held_parcels.map((p) => p.id);
	if(held_parcels_ids.length !== 0) {
		beliefs.mapBeliefs.delivery_tiles.forEach((d) => desires.add_intention(new GoPutDown(held_parcels_ids, d.toPosition())))
	}
	
	if(GENERATION_LOG) console.log("optionsGeneration_simple : generated desires -> " + desires.intentions.length);
	return desires;
}