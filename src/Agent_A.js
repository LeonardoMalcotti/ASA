import Agent from "./agents/Agent.js";
import {onMapCallback_simple} from "./sensing/onMapCallback.js";
import {onAgentCallback_simple} from "./sensing/onAgentCallback.js";
import {onParcelCallback_simple} from "./sensing/onParcelCallback.js";
import onMessageCallback from "./communications/OnMessageCallback.js";
import {optionsGeneration_simple} from "./decision/OptionsGeneration.js";
import {optionFiltering} from "./decision/OptionFiltering.js";
import {deliberate_precise} from "./decision/Deliberate.js";
import {intentionRevision_non_stubborn} from "./decision/IntentionRevision.js";
import plan_pddl_2 from "./planning/PDDLPlanning_fewer_predicates.js";
import {communication_token, tokens} from "../config.js";


let agent_A = new Agent(
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
await agent_A.configure();