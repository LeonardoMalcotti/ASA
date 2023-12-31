import {onMapCallback_simple} from "./sensing/onMapCallback.js";
import {onAgentCallback_simple} from "./sensing/onAgentCallback.js";
import {optionsGeneration_simple} from "./decision/OptionsGeneration.js";
import {optionFiltering} from "./decision/OptionFiltering.js";
import {deliberate_precise} from "./decision/Deliberate.js";
import {intentionRevision_non_stubborn} from "./decision/IntentionRevision.js";
import {onParcelCallback_simple} from "./sensing/onParcelCallback.js";
import Agent from "./agents/Agent.js";
import onMessageCallback from "./communications/OnMessageCallback.js";
import plan_pddl_2 from "./planning/PDDLPlanning_fewer_predicates.js";


/** @type {string} */
let communication_token = crypto.randomUUID();


let agent = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	onMessageCallback,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_non_stubborn,
	plan_pddl_2
);
await agent.configure(120000);




