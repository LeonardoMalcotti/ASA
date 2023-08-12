import {roundedPosition} from "../classes/Position.js";
import ParcelBelief from "../classes/ParcelBelief.js";


const PARCEL_PROBABILITY_DECAY = 0.05;
const PARCEL_PROBABILITY_TRESHOLD = 0.5;


/**
 * @param {ParcelData[]} parcels
 * @param {BeliefSet} beliefs
 * @param {IntentionRevisionCallback} reviseIntention
 * @returns {Promise<void>}
 */
export async function onParcelCallback_simple(parcels, beliefs, reviseIntention){

    for(let existing_belief of beliefs.parcelBeliefs){
        let new_data = parcels.find((p) => p.id === existing_belief.id)
        if(new_data !== undefined){
            // update parcel belief

            existing_belief.position = roundedPosition(new_data.x, new_data.y);
            existing_belief.reward = new_data.reward;
            existing_belief.held_by = new_data.carriedBy;
            existing_belief.probability = 1;
            existing_belief.time = Date.now();

            parcels.splice(parcels.indexOf(new_data),1);
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
            existing_belief.time = Date.now();
            existing_belief.reward = existing_belief.reward - 1; // quite arbitrary, it should consider how much has passed, but the configuration on decay rate is not helping

            if(existing_belief.reward <= 0){
                beliefs.deleteParcelBelief(existing_belief);
                continue;
            }

            if(existing_belief.held_by !== ""){
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

        beliefs.parcelBeliefs.push(ParcelBelief.fromParcelData(newData))
    }

    if(revise){
        reviseIntention()
    }
}