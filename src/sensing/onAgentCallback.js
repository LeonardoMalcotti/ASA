import {roundedPosition} from "../classes/Position.js";
import AgentBelief from "../classes/AgentBelief.js";
import Say from "../actions/Say.js";

const AGENT_PROBABILITY_DECAY = 0.1;
const AGENT_PROBABILITY_THRESHOLD = 0.7;

/**
 * @param {AgentData[]} agents
 * @param {BeliefSet} beliefs
 * @returns {Promise<void>}
 */
export async function onAgentCallback_simple(agents,beliefs, client) {
	//console.log("called onAgentCallback_simple");
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
			// in this implementation we will just reduce the probability of an agent being there
			
			existing_belief.probability = existing_belief.probability - AGENT_PROBABILITY_DECAY;
			existing_belief.time = Date.now();
			
			if(existing_belief.probability <= AGENT_PROBABILITY_THRESHOLD){
				beliefs.deleteAgentBelief(existing_belief);
			}
		}
	}

	for(let newData of agents) {
		beliefs.agentBeliefs.push(AgentBelief.fromAgentData(newData));
	}
	
	if(beliefs.allies.length !== 0 && agents.length > 0){
		for (const id of beliefs.allies) {
			await (new Say(
				id,
				{
					topic : "AgentSensing",
					cnt : agents,
					token : beliefs.communication_token,
					msg_id : crypto.randomUUID()
				}
			)).execute(client,beliefs);
		}
	}
}