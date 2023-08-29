import {onMapCallback_simple} from "./sensing/onMapCallback.js";
import {onAgentCallback_simple} from "./sensing/onAgentCallback.js";
import {optionsGeneration_simple} from "./decision/OptionsGeneration.js";
import {optionFiltering} from "./decision/OptionFiltering.js";
import {deliberate_precise} from "./decision/Deliberate.js";
import {intentionRevision_non_stubborn} from "./decision/IntentionRevision.js";
import {do_nothing, only_ask, plan_simple} from "./planning/Planning.js";
import {onParcelCallback_simple} from "./sensing/onParcelCallback.js";
import Agent from "./agents/Agent.js";
import plan_pddl from "./planning/PDDLPlanning.js";
import plan_pddl_2 from "./planning/PDDLPlanning_fewer_predicates.js";
import onMessageCallback from "./communications/OnMessageCallback.js";



/** @type {string} */
let communication_token = crypto.randomUUID();

/*
for(let t of tokens) {
	let agent = new Agent(
		onMapCallback_simple,
		onAgentCallback_simple,
		onParcelCallback_simple,
		optionsGeneration_simple,
		optionFiltering,
		deliberate_precise,
		intentionRevision_non_stubborn,
		plan_simple,
		t
	);
	await agent.configure(30000);
}*/

/*
let agent = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_non_stubborn,
	plan_pddl_2
);
await agent.configure(120000);*/


// testing communication
let agent_shouting = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	onMessageCallback,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_non_stubborn,
	plan_pddl_2,
	tokens[0],
	communication_token
);
await agent_shouting.configure();

let agent_listening = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	onMessageCallback,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_non_stubborn,
	plan_pddl_2,
	tokens[1],
	communication_token
);
await agent_listening.configure();


