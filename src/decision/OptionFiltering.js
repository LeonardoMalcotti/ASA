import {FILTERING_LOG} from "../../config.js";

/**
 * @param {BeliefSet} beliefs
 * @param {DesireSet} desires
 * @return {DesireSet}
 */
export async function optionFiltering(beliefs, desires) {
	if(FILTERING_LOG) console.log("optionFiltering");
	let achvbl = await Promise.all(desires.intentions.map((i)=>i.achievable(beliefs)));
	desires.intentions = desires.intentions.filter((v,i) => achvbl[i]);
	if(FILTERING_LOG) console.log("optionFiltering : achievable desires -> " + desires.intentions.length);
	return desires;
}