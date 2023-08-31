import {Collaboration} from "../intentions/Collaboration.js";
import Ask from "../actions/Ask.js";

/**
 * @param {BeliefSet} beliefs
 * @param {string} ally
 * @return {Promise<Object|false>}
 */
export async function askPosition(beliefs, ally){
	return await (new Ask(
		ally,
		{
			token: beliefs.communication_token,
			topic : "CurrentPosition"
		}
	)).execute(beliefs);
}

/**
 * @param {BeliefSet} beliefs
 */
export async function startCollaboration(beliefs){
	if(beliefs.currentIntention instanceof Collaboration){
		return await (new Ask(
			beliefs.currentIntention.ally,
			{
				token: beliefs.communication_token,
				topic : "StartCollaboration"
			}
		)).execute(beliefs);
	}
	return false;
}

/**
 * @param {BeliefSet} beliefs
 * @param {string} ally
 */
export function startCollaborationAction(beliefs, ally){
	return new Ask(
		ally,
		{
			token: beliefs.communication_token,
			topic : "StartCollaboration"
		}
	);
}

/**
 * @param {BeliefSet} beliefs
 */
export async function endCollaboration(beliefs){
	if(beliefs.currentIntention instanceof Collaboration){
		return await (new Ask(
			beliefs.currentIntention.ally,
			{
				topic : "EndCollaboration",
				token: beliefs.communication_token
			}
		)).execute(beliefs);
	}
	return false;
}

/**
 * @param {BeliefSet} beliefs
 * @param {string} ally
 */
export function endCollaborationAction(beliefs, ally){
	return new Ask(
		ally,
		{
			topic : "EndCollaboration",
			token: beliefs.communication_token
		}
	);
}

/**
 * @param {BeliefSet} beliefs
 * @param {string} ally
 * @param {string} parcel_id
 * @param {Position} position
 */
export function goPickUpAction(beliefs, ally, parcel_id, position){
	return new Ask(
		ally,
		{
			topic: "GoPickUp",
			token: beliefs.communication_token,
			cnt: {
				parcels_id : parcel_id,
				position : position
			}
		}
	);
}