import DefaultIntention from "../intentions/DefaultIntention.js";

/**
 * @param {BeliefSet} beliefs
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {ChangePlanCallBack} change_plan
 */
export async function intentionRevision_simple(beliefs,
                                               optionsGeneration,
                                               optionsFiltering,
                                               deliberate,
                                               change_plan){
	
	if(beliefs.revision_running){
		console.warn("concurrent revision blocked------------------------------------");
		return;
	}
	
	beliefs.revision_running = true;
	
	console.log("intentionRevision_simple : current intention -> " + beliefs.currentIntention.description());
	
	let current_intention_achievable = await beliefs.currentIntention.achievable(beliefs);
	
	// in this case the current intention has to be changed
	if (beliefs.currentIntention instanceof DefaultIntention || !current_intention_achievable)
	{
		let options = optionsGeneration(beliefs);
		let filtered = await optionsFiltering(beliefs,options);
		let intention = await deliberate(beliefs,filtered);
		
		if(!intention instanceof DefaultIntention){
			await change_plan(intention);
		} else {
			if (beliefs.currentIntention.status === "completed" ||
				beliefs.currentIntention.status === "failed") {
				await change_plan(intention);
			}
		}
	} else {
		console.log("intentionRevision_simple : did not change intention");
	}
}