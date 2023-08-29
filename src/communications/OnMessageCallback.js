import Say from "../actions/Say.js";
import {ON_MESSAGE_LOG} from "../../config.js";

/**
 * @param {BeliefSet} beliefs
 * @param {string} id
 * @param {string} name
 * @param {Message} msg
 * @param {function(string)} cll
 */
export default async function onMessageCallback(beliefs, id,name, msg, cll){
	
	if(msg.topic === "Ally?"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Ally?");
		beliefs.currentPlan.actions.unshift(new Say(id, {
			topic : "Ally!",
			cnt : undefined,
			token : beliefs.communication_token,
			msg_id : msg.msg_id
		}));
		beliefs.allies.push(id);
		return;
	}
	
	if(msg.token !== beliefs.communication_token){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message filtered, wrong token");
		return;
	}
	
	if(msg.topic === "Ally!"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Ally!");
		beliefs.allies.push(id);
		return;
	}
	
	if(msg.topic === "ParcelSensing"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : ParcelSensing");
		await beliefs.updateParcelBeliefs(msg.cnt);
		return;
	}
	
	if(msg.topic === "AgentSensing"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : AgentSensing");
		await beliefs.updateAgentBeliefs(msg.cnt);
		return;
	}
}