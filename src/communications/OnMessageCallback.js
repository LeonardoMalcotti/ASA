import Say from "../actions/Say.js";
import {ON_MESSAGE_LOG} from "../../config.js";
import GoPickUp from "../intentions/GoPickUp.js";
import GoPutDown from "../intentions/GoPutDown.js";
import DiscoverAlly from "../intentions/DiscoverAlly.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import ParcelBelief from "../classes/ParcelBelief.js";
import {calculate_path_considering_nearby_agents} from "../utils/astar.js";
import {Collaboration} from "../intentions/Collaboration.js";
import GoUp from "../actions/GoUp.js";
import GoDown from "../actions/GoDown.js";
import GoLeft from "../actions/GoLeft.js";
import GoRight from "../actions/GoRight.js";
import PickUp from "../actions/PickUp.js";
import PutDown from "../actions/PutDown.js";
import BringTo from "../intentions/BringTo.js";
import Plan from "../actions/Plan.js";
import {plan_go_pick_up} from "../planning/Planning.js";

/**
 * @param {BeliefSet} beliefs
 * @param {string} id
 * @param {string} name
 * @param {Message} msg
 * @param {function(any)} cll
 * @param {IntentionRevisionCallback} revise
 */
export default async function onMessageCallback(beliefs, id,name, msg, cll, revise){
	
	if(msg.topic === "Ally?"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Ally?");
		
		await new Say(id, {
			topic : "Ally!",
			cnt : undefined,
			token : beliefs.communication_token
		}).execute(beliefs);
		
		beliefs.allies.push({id:id, intention: undefined});
		return;
	}
	
	// communication with allies only
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
	
	if(msg.topic === "CurrentPosition"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : CurrentPosition");
		if(cll === undefined){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " callback is unavailable");
			return;
		}
		cll(beliefs.my_position());
		return;
	}
	
	if(msg.topic === "Available?"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Available?");
		
		if(cll === undefined){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " callback is unavailable");
			return;
		}
		
		if(msg.cnt.type === "BringTo"){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " check bring to availability");
			let final_reward = await BringTo.check_availability(
				beliefs,
				msg.cnt.position,
				msg.cnt.parcels,
				msg.cnt.possible_rewards);
			
			if(final_reward > 0){
				cll({
					res: "Yes",
					final_reward: final_reward
				});
			} else {
				cll({res: "No"});
			}
		}
		
		return;
	}
	
	if(msg.topic === "Collaborating?"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : Collaborating?");
		
		if(cll === undefined){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " callback is unavailable");
			return;
		}
		
		if((beliefs.currentIntention instanceof Collaboration) &&
			beliefs.currentIntention.ally === id){
			cll("Yes");
		} else {
			cll("No");
		}
		
		return;
	}
	
	if(msg.topic === "StartCollaboration"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : StartCollaboration");
		if(cll === undefined){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " callback is unavailable");
			return;
		}
		
		beliefs.currentIntention = new Collaboration(id);
		beliefs.currentPlan.actions = [];
		cll("Yes");
	}
	
	// available only if the agent is collaborating
	if(!(beliefs.currentIntention instanceof Collaboration)){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " agent is not collaborating");
		if(cll) cll("No");
		return;
	}
	
	if(msg.topic === "EndCollaboration"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : EndCollaboration");
		if(cll === undefined){
			if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " callback is unavailable");
			return;
		}
		beliefs.currentIntention = new DefaultIntention();
		beliefs.currentPlan.actions = [];
		cll("Yes");
		revise();
	}
	
	if(msg.topic === "GoUp"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : GoUp");
		/** @type {Position} */
		let position = msg.cnt.position;
		let res = await(new GoUp(position)).execute(beliefs);
		if(res === undefined || res === "false"){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "GoDown"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : GoDown");
		/** @type {Position} */
		let position = msg.cnt.position;
		let res = await(new GoDown(position)).execute(beliefs);
		if(res === undefined || res === "false"){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "GoLeft"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : GoLeft");
		/** @type {Position} */
		let position = msg.cnt.position;
		let res = await(new GoLeft(position)).execute(beliefs);
		if(res === undefined || res === "false"){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "GoRight"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : GoRight");
		/** @type {Position} */
		let position = msg.cnt.position;
		let res = await(new GoRight(position)).execute(beliefs);
		if(res === undefined || res === "false"){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "PickUp"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : PickUp");
		let res = await(new PickUp()).execute(beliefs);
		if(res === undefined || res.length === 0){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "PutDown"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : PutDown");
		let res = await(new PutDown()).execute(beliefs);
		if(res === undefined || res.length === 0){
			cll("No");
		} else{
			cll("Yes");
		}
		return;
	}
	
	if(msg.topic === "GoPickUp"){
		if(ON_MESSAGE_LOG) console.log(beliefs.me.id + " message received : GoPickUp");
		let plan = new Plan();
		let intention = new GoPickUp(msg.cnt.parcel_id,msg.cnt.position);
		await plan_go_pick_up(beliefs,intention,plan);
		while (plan.actions.length > 0){
			let action = plan.actions.shift();
			let res = await action.execute(beliefs);
			if(res === undefined || res === false){
				cll("No");
				return;
			}
			await new Promise( (r) => {setTimeout(r)} );
		}
		cll("Yes");
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