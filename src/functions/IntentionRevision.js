import DefaultIntention from "../intentions/DefaultIntention.js";

/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {IntentionRevisionCompletion} completion
 * @return {void}
 */
export async function intentionRevision_simple(beliefs,
                                         currentIntention,
                                         optionsGeneration,
                                         optionsFiltering,
                                         deliberate,
                                         completion){
	console.log("called intentionRevision_simple");
	console.log("current intention : " + currentIntention);
	if(currentIntention === undefined){
		console.log("current intention is undefined")
		currentIntention = new DefaultIntention();
	}
	
	let current_intention_achievable = await currentIntention.achievable(beliefs);
	
	if (currentIntention instanceof DefaultIntention ||
		!current_intention_achievable)
	{
		let options = optionsGeneration(beliefs,currentIntention);
		let filtered = await optionsFiltering(beliefs,currentIntention,options);
		let intention = deliberate(beliefs,currentIntention,filtered);
		completion(intention);
	} else {
		console.log("did not change intention");
		// check existence of a better option
	}
}