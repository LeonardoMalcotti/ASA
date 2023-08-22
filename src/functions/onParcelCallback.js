import {roundedPosition} from "../classes/Position.js";
import ParcelBelief from "../classes/ParcelBelief.js";
import {remove_from_list} from "../utils/Utils.js";


const PARCEL_PROBABILITY_DECAY = 0.05;
const PARCEL_PROBABILITY_TRESHOLD = 0.5;


/**
 * @param {ParcelData[]} parcels
 * @param {BeliefSet} beliefs
 * @param {IntentionRevisionCallback} reviseIntention
 * @returns {Promise<void>}
 */
export async function onParcelCallback_simple(parcels, beliefs, reviseIntention){
    //console.log("called onParcelCallback_simple");
    for(let existing_belief of beliefs.parcelBeliefs){
        let new_data = parcels.find((p) => p.id === existing_belief.id)
        if(new_data !== undefined){
            // update parcel belief

            existing_belief.position = roundedPosition(new_data.x, new_data.y);
            existing_belief.reward = new_data.reward;
            existing_belief.held_by = new_data.carriedBy;
            existing_belief.probability = 1;
            existing_belief.time = Date.now();

            remove_from_list(parcels,new_data);
        } else {
            // infer parcel belief

            // to be noted: in this section we are trying to infer new data about parcels that were in
            // the belief set, but we didn't receive new information

            // if the parcel was held by us, we can safely assume that it was delivered or expired
            if(existing_belief.held_by === beliefs.me.id){
                beliefs.deleteParcelBelief(existing_belief);
                continue;
            }

            existing_belief.probability = existing_belief.probability - PARCEL_PROBABILITY_DECAY;
            let now = Date.now();
            let time_passed = (now - existing_belief.time) / 1000;
            existing_belief.reward = existing_belief.reward_after_n_seconds(beliefs,time_passed);
            existing_belief.time = now;
            
            if(existing_belief.reward <= 0){
                beliefs.deleteParcelBelief(existing_belief);
                continue;
            }

            if(existing_belief.held_by !== null){
                beliefs.deleteParcelBelief(existing_belief);
                continue;
            }

            if(existing_belief.probability <= PARCEL_PROBABILITY_TRESHOLD){
                beliefs.deleteParcelBelief(existing_belief);
            }
        }
    }

    let revise = false;

    // add to the beliefs all the remaining data received
    for(let newData of parcels) {

        // if at least one new parcel is free, trigger intention revision
        if(newData.carriedBy === null){
            revise = true
        }

        // ignoring step of calculating nearest destination

        beliefs.parcelBeliefs.push(ParcelBelief.fromParcelData(newData));
    }

    if(revise !== false){
        console.log("onParcelCallback_simple : calling intention revision");
        reviseIntention();
    }
}