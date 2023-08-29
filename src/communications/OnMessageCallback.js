import Say from "../actions/Say.js";
import {ON_MESSAGE_LOG} from "../../config.js";
import GoPickUp from "../intentions/GoPickUp.js";
import GoPutDown from "../intentions/GoPutDown.js";
import DiscoverAlly from "../intentions/DiscoverAlly.js";
import DefaultIntention from "../intentions/DefaultIntention.js";

/**
 * @param {BeliefSet} beliefs
 * @param {DeliverooApi} client
 * @param {string} id
 * @param {string} name
 * @param {Message} msg
 * @param {function(string)} cll
 * @param {IntentionRevisionCallback} revise
 */
export default async function onMessageCallback(beliefs,client, id,name, msg, cll, revise){
	
	if(msg.topic === "Ally?"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Ally?");
		
		await new Say(id, {
			topic : "Ally!",
			cnt : undefined,
			token : beliefs.communication_token,
			msg_id : msg.msg_id
		}).execute(client,beliefs);
		
		beliefs.allies.push({id:id, intention: undefined});
		return;
	}
	
	if(msg.token !== beliefs.communication_token){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message filtered, wrong token");
		return;
	}
	
	if(msg.topic === "Ally!"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Ally!");
		beliefs.allies.push({id:id, intention: undefined});
		return;
	}
	
	if(msg.topic === "ParcelSensing"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : ParcelSensing");
		await beliefs.updateParcelBeliefs(msg.cnt);
		revise();
		return;
	}
	
	if(msg.topic === "AgentSensing"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : AgentSensing");
		await beliefs.updateAgentBeliefs(msg.cnt);
		revise();
		return;
	}
	
	if(msg.topic === "NewIntention"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : NewIntention");
		beliefs.allies = beliefs.allies.map((a) => {
			if(a.id === id){
				a.intention = msg_cnt_to_intention(msg.cnt);
				return a;
			} else {
				return a;
			}
		})
		revise();
		return;
	}
}

/**
 *
 * @param cnt
 * @return {Intention}
 */
function msg_cnt_to_intention(cnt){
	if(cnt.type === "GoPickUp"){
		let tmp = new GoPickUp(cnt.val.parcel_id,cnt.val.position);
		tmp.possible_reward = cnt.val.possible_reward;
		tmp.possible_path = cnt.val.possible_path;
		return tmp;
	}
	if(cnt.type === "GoPutDown"){
		let tmp = new GoPutDown(cnt.val.parcels_id, cnt.val.position);
		tmp.possible_reward = cnt.val.possible_reward;
		tmp.possible_path = cnt.val.possible_path;
		return tmp;
	}
	if(cnt.type === "DiscoverAlly"){
		return new DiscoverAlly();
	}
	
	return new DefaultIntention();
}