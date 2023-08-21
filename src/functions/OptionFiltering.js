/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {DesireSet} desires
 * @return {DesireSet}
 */
export async function optionFiltering(beliefs, currentIntention, desires) {
	console.log("optionFiltering");
	let achvbl = await Promise.all(desires.intentions.map((i)=>i.achievable(beliefs)));
	desires.intentions = desires.intentions.filter((v,i) => achvbl[i]);
	console.log("optionFiltering : achievable desires -> " + desires.intentions.length);
	return desires;
}