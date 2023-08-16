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
	if(currentIntention === undefined){
		console.log("current intention is undefined")
		currentIntention = new DefaultIntention();
	}
	if (currentIntention instanceof DefaultIntention ||
		!await currentIntention.achievable(beliefs))
	{
		let options = optionsGeneration(beliefs,currentIntention);
		console.log("all options")
		console.log(options.intentions);
		options = await optionsFiltering(beliefs,currentIntention,options);
		console.log("filtered options")
		console.log(options.intentions);
		let intention = deliberate(beliefs,currentIntention,options);
		console.log("deliberated one")
		console.log(intention);
		completion(intention);
	} else {
		// check existence of a better option
	}
}