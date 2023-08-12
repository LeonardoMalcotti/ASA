import {roundedPosition} from "../classes/Position.js";
import AgentBelief from "../classes/AgentBelief.js";

/**
 * @param {AgentData[]} agents
 * @param {BeliefSet} beliefs
 * @returns {Promise<void>}
 */
export async function onAgentCallback_simple(agents,beliefs) {

	for(let existing_belief of beliefs.agentBeliefs){
		let new_data = agents.find((a) => a.id === existing_belief.id);
		if(new_data !== undefined){
			//update agent belief

			existing_belief.score = new_data.score;
			existing_belief.position = roundedPosition(new_data.x,new_data.y);
			existing_belief.probability = 1;
			existing_belief.time = Date.now();

			agents.splice(agents.indexOf(new_data),1);
		} else {
			// infer agent belief

			// should consider the believed intention and execute a step of it
			// in this implementation we will just forget about agents not sensed

			beliefs.deleteAgentBelief(existing_belief);

		}
	}

	for(let newData of agents) {
		beliefs.agentBeliefs.push(AgentBelief.fromAgentData(newData));
	}
}