

/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {DesireSet} desires
 * @return {DesireSet}
 */
export async function optionFiltering(beliefs, currentIntention, desires) {
	console.log("called optionFiltering");
	for(let I of desires.intentions.entries()){
		let res = await I[1].achievable(beliefs);
		if(!res){
			desires.intentions.splice(I[0],1);
		}
	}

	/*desires.intentions = desires.intentions.filter((I) => {
		let res = I.achievable(beliefs);
		return res.then((r) => r).catch(() => false)
	});*/
	return desires;
}