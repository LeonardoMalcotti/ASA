

/**
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {DesireSet} desires
 * @return {DesireSet}
 */
export function optionFiltering(beliefs, currentIntention, desires) {
	desires.intentions = desires.intentions.filter((I) => I.achievable(beliefs));
	return desires;
}