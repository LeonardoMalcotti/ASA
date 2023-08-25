import DefaultIntention from "../intentions/DefaultIntention.js";

/**
 * stubborn (?)
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
	
	if(beliefs.revision_running) return;
	beliefs.revision_running = true;
	
	console.log("intentionRevision_simple : current intention -> " + beliefs.currentIntention.description());
	
	let current_intention_achievable = await beliefs.currentIntention.achievable(beliefs);
	if(current_intention_achievable) console.log("intentionRevision_simple : intention still achievable");
	
	// in this case the current intention has to be changed
	if (beliefs.currentIntention instanceof DefaultIntention ||
		!current_intention_achievable)
	{
		let options = optionsGeneration(beliefs);
		let filtered = await optionsFiltering(beliefs,options);
		let intention = await deliberate(beliefs,filtered);
		
		if(!(intention instanceof DefaultIntention)){
			await change_plan(intention);
		} else {
			if (beliefs.currentIntention.status === "completed" ||
				beliefs.currentIntention.status === "failed" ||
				beliefs.currentIntention.status === "stopped") {
				await change_plan(intention);
			} else {
				console.log("intentionRevision_simple : did not change intention");
				console.log("revision completed");
				beliefs.revision_running = false;
			}
		}
	} else {
		console.log("intentionRevision_simple : did not change intention");
		console.log("revision completed");
		beliefs.revision_running = false;
	}
}

/**
 * stubborn (?)
 * @param {BeliefSet} beliefs
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {ChangePlanCallBack} change_plan
 */
export async function intentionRevision_non_stubborn(beliefs,
                                               optionsGeneration,
                                               optionsFiltering,
                                               deliberate,
                                               change_plan){
	
	if(beliefs.revision_running) return;
	beliefs.revision_running = true;
	
	console.log("intentionRevision_simple : current intention -> " + beliefs.currentIntention.description());
	
	let current_intention_achievable = await beliefs.currentIntention.achievable(beliefs);
	if(current_intention_achievable) console.log("intentionRevision_simple : intention still achievable");
	
	let options = optionsGeneration(beliefs);
	let filtered = await optionsFiltering(beliefs,options);
	
	//filtered.intentions = filtered.intentions.filter((i) => i.hash() !== beliefs.currentIntention.hash());
	
	let intention = await deliberate(beliefs,filtered);
	
	if(!current_intention_achievable){
		await change_plan(intention);
		return;
	}
	
	if(!(intention instanceof DefaultIntention)){
		await change_plan(intention);
		return;
	}
	
	if (beliefs.currentIntention.status === "completed" ||
		beliefs.currentIntention.status === "failed" ||
		beliefs.currentIntention.status === "stopped") {
		await change_plan(intention);
	} else {
		console.log("intentionRevision_simple : did not change intention");
		console.log("revision completed");
		beliefs.revision_running = false;
	}
}