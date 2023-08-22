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
                                               optionsGeneration,
                                               optionsFiltering,
                                               deliberate,
                                               revision_running,
                                               completion){
	
	if(revision_running){
		console.warn("concurrent revision blocked------------------------------------");
		return;
	}
	
	revision_running = true;
	
	console.log("intentionRevision_simple : current intention -> " + beliefs.currentIntention.description());
	
	let current_intention_achievable = await beliefs.currentIntention.achievable(beliefs);
	
	// in this case the current intention has to be changed
	if (beliefs.currentIntention instanceof DefaultIntention || !current_intention_achievable)
	{
		let options = optionsGeneration(beliefs);
		let filtered = await optionsFiltering(beliefs,options);
		let intention = await deliberate(beliefs,filtered);
		
		if(!intention instanceof DefaultIntention){
			completion(intention);
		} else {
			if(beliefs.currentIntention.achieved) {
				completion(intention);
			}
		}
	} else {
		console.log("intentionRevision_simple : did not change intention");
	}
}