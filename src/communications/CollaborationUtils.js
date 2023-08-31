import {Collaboration} from "../intentions/Collaboration.js";
import Ask from "../actions/Ask.js";

/**
 * @param {BeliefSet} beliefs
 */
export async function startCollaboration(beliefs){
	if(beliefs.currentIntention instanceof Collaboration){
		return await (new Ask(
			beliefs.currentIntention.ally,
			{topic : "StartCollaboration"}
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
		{topic : "StartCollaboration"}
	);
}

/**
 * @param {BeliefSet} beliefs
 */
export async function endCollaboration(beliefs){
	if(beliefs.currentIntention instanceof Collaboration){
		return await (new Ask(
			beliefs.currentIntention.ally,
			{topic : "EndCollaboration"}
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
		{topic : "EndCollaboration"}
	);
}
