import {DefaultIntention} from "../models/Intention.js";

/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {IntentionRevisionCompletion} completion
 * @return {void}
 */
export function intentionRevision_simple(beliefs,
                                         currentIntention,
                                         optionsGeneration,
                                         optionsFiltering,
                                         deliberate,
                                         completion){

	if (currentIntention instanceof DefaultIntention ||
		!intentionApplicable(currentIntention,beliefs))
	{
		let options = optionsGeneration(beliefs,currentIntention);
		options = optionsFiltering(beliefs,currentIntention,options);
		let intention = deliberate(beliefs,currentIntention,options);
		completion(intention);
	} else {
		// check existence of a better option
	}
}

/**
 *
 * @param {Intention} intention
 * @param {BeliefSet} beliefs
 * @return {Boolean}
 */
function intentionApplicable(intention, beliefs){
	return true
}
