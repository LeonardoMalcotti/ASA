import DefaultIntention from "../intentions/DefaultIntention.js";

/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {boolean} revision_running
 * @param {IntentionRevisionCompletion} completion
 */
export async function intentionRevision_simple(beliefs,
                                         currentIntention,
                                         optionsGeneration,
                                         optionsFiltering,
                                         deliberate,
                                               revision_running,
                                         completion){
	
	if(revision_running){
		return;
	}
	
	revision_running = true;
	
	console.log("intentionRevision_simple : current intention -> " + currentIntention.description());
	
	let current_intention_achievable = await currentIntention.achievable(beliefs);
	
	// in this case the current intention has to be changed
	if (currentIntention instanceof DefaultIntention || !current_intention_achievable)
	{
		let options = optionsGeneration(beliefs,currentIntention);
		let filtered = await optionsFiltering(beliefs,currentIntention,options);
		let intention = deliberate(beliefs,currentIntention,filtered);
		
		if(intention !== undefined) {
			completion(intention);
		} else if (!currentIntention instanceof DefaultIntention) {
			completion(new DefaultIntention());
		}
	} else {
		console.log("intentionRevision_simple : did not change intention");
	}
	
	revision_running = false;
}