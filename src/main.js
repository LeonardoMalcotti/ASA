import Agent from "./Agent.js";
import {onMapCallback_simple} from "./functions/onMapCallback.js";
import {onAgentCallback_simple} from "./functions/onAgentCallback.js";
import {onParcelCallback_simple} from "./functions/onParcelCallback.js";
import {optionsGeneration_simple} from "./functions/OptionsGeneration.js";
import {optionFiltering} from "./functions/OptionFiltering.js";
import {deliberate_precise} from "./functions/Deliberate.js";
import {intentionRevision_simple} from "./functions/IntentionRevision.js";
import {plan_simple} from "./functions/Planning.js";

let agent = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_simple,
	plan_simple
);

agent.configure();