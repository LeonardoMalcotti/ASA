import Say from "../actions/Say.js";

/**
 * @param {BeliefSet} beliefs
 * @param {string} id
 * @param {string} name
 * @param {Message} msg
 * @param {function(string)} cll
 */
export default async function onMessageCallback(beliefs, id,name, msg, cll){
	console.log(beliefs.me.name + " received message:");
	console.log(id);
	console.log(name);
	console.log(msg);
	
	if(msg.topic === "Ally?"){
		beliefs.currentPlan.actions.unshift(new Say(id, {
			topic : "Ally!",
			cnt : undefined,
			token : beliefs.communication_token,
			msg_id : msg.msg_id
		}));
		beliefs.allies.push(id);
	}
	
	if(msg.token !== beliefs.communication_token){
		return;
	}
	
	if(msg.topic === "Ally!"){
		beliefs.allies.push(id);
	}
	
	if(msg.topic === "ParcelSensing"){
		beliefs.updateParcelBeliefs(msg.cnt);
	}
	
	if(msg.topic === "AgentSensing"){
		beliefs.updateAgentBeliefs(msg.cnt);
	}
}