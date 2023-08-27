import {onMapCallback_simple} from "./sensing/onMapCallback.js";
import {onAgentCallback_simple} from "./sensing/onAgentCallback.js";
import {optionsGeneration_simple} from "./decision/OptionsGeneration.js";
import {optionFiltering} from "./decision/OptionFiltering.js";
import {deliberate_precise} from "./decision/Deliberate.js";
import {intentionRevision_non_stubborn} from "./decision/IntentionRevision.js";
import {plan_simple} from "./planning/Planning.js";
import {onParcelCallback_simple} from "./sensing/onParcelCallback.js";
import Agent from "./agents/Agent.js";
import plan_pddl from "./planning/PDDLPlanning.js";

let tokens = [
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhMzExZmQxMWM5IiwibmFtZSI6ImExIiwiaWF0IjoxNjkyNzg5ODA2fQ.mvSsAbQ8AzAhGUsh5lVPh5ozo2-67gqfcCJ8hrZ0eGQ",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxMWZkMTFjOWYyIiwibmFtZSI6ImEyIiwiaWF0IjoxNjkyNzg5ODU3fQ.mjUw2lF8lfAt2tFTyvJUw4d-gbnvqtBPhZ3eEoaJj1Y",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZmQxMWM5ZjJjIiwibmFtZSI6ImEzIiwiaWF0IjoxNjkyNzg5OTI0fQ.c2FP4AB484ME_W5GKNZ_vyrF-T17edtAdzCbWaiXuEo",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmZDExYzlmMmM2IiwibmFtZSI6ImE0IiwiaWF0IjoxNjkyNzg5OTQ2fQ.e5_W91aqPtUYh3fu1Jsp9tio8PJPwf1yX3ETJU5FC9A"
]



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

let agent = new Agent(
	onMapCallback_simple,
	onAgentCallback_simple,
	onParcelCallback_simple,
	optionsGeneration_simple,
	optionFiltering,
	deliberate_precise,
	intentionRevision_non_stubborn,
	plan_pddl
);
await agent.configure(120000);

