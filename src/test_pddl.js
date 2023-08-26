import { onlineSolver} from "@unitn-asa/pddl-client";
import PDDLVariable from "./PDDLClasses/PDDLVariable.js";
import PDDLStatement from "./PDDLClasses/PDDLStatement.js";
import PDDLAction from "./PDDLClasses/PDDLAction.js";
import PDDLCondition from "./PDDLClasses/PDDLCondition.js";
import PDDLDomain from "./PDDLClasses/PDDLDomain.js";
import PDDLProblem from "./PDDLClasses/PDDLProblem.js";



let x_var = new PDDLVariable("x");
let y_var = new PDDLVariable("y");
let z_var = new PDDLVariable("z");

let is_room_predicate = new PDDLStatement("ROOM",[x_var]);
let is_ball_predicate = new PDDLStatement("BALL",[x_var]);
let is_gripper_predicate = new PDDLStatement("GRIPPER",[x_var]);
let is_free_predicate = new PDDLStatement("FREE",[x_var]);
let at_robby_predicate = new PDDLStatement("at-robby", [x_var]);
let at_ball_predicate = new PDDLStatement("at-ball", [x_var, y_var]);
let carry_predicate = new PDDLStatement("carry", [x_var, y_var]);

let move_action = new PDDLAction(
	"move",
	[x_var,y_var],
	new PDDLCondition([
		is_room_predicate.with([x_var]),
		is_room_predicate.with([y_var]),
		at_robby_predicate.with([x_var])
	]),
	new PDDLCondition([
		at_robby_predicate.with([x_var]).not(),
		at_robby_predicate.with([y_var])
	])
);

let pick_up_action = new PDDLAction(
	"pick-up",
	[x_var, y_var, z_var],
	new PDDLCondition([
		is_ball_predicate.with([x_var]),
		is_room_predicate.with([y_var]),
		is_gripper_predicate.with([z_var]),
		at_ball_predicate.with([x_var,y_var]),
		at_robby_predicate.with([y_var]),
		is_free_predicate.with([z_var])
	]),
	new PDDLCondition([
		carry_predicate.with([z_var,x_var]),
		at_ball_predicate.with([x_var,y_var]).not(),
		is_free_predicate.with([z_var]).not()
	])
);

let drop_action = new PDDLAction(
	"drop",
	[x_var, y_var, z_var],
	new PDDLCondition([
		is_ball_predicate.with([x_var]),
		is_room_predicate.with([y_var]),
		is_gripper_predicate.with([z_var]),
		carry_predicate.with([z_var,x_var]),
		at_robby_predicate.with([y_var])
	]),
	new PDDLCondition([
		carry_predicate.with([z_var,x_var]).not(),
		at_ball_predicate.with([x_var,y_var]),
		is_free_predicate.with([z_var])
	])
);

let gripper_domain = new PDDLDomain(
	"gripper",
	[
		is_room_predicate, is_ball_predicate,
		is_gripper_predicate, is_free_predicate,
		at_robby_predicate, at_ball_predicate, carry_predicate
	],
	[
		move_action,
		pick_up_action,
		drop_action
	]
);

let gripper_problem = new PDDLProblem(
	"gripper-prob",
	"gripper",
	[
		is_room_predicate.with(["rooma"]),
		is_room_predicate.with(["roomb"]),
		is_ball_predicate.with(["ball1"]),
		is_ball_predicate.with(["ball2"]),
		is_ball_predicate.with(["ball3"]),
		is_ball_predicate.with(["ball4"]),
		is_gripper_predicate.with(["left"]),
		is_gripper_predicate.with(["right"]),
		is_free_predicate.with(["left"]),
		is_free_predicate.with(["right"]),
		at_robby_predicate.with(["rooma"]),
		at_ball_predicate.with(["ball1", "rooma"]),
		at_ball_predicate.with(["ball2", "rooma"]),
		at_ball_predicate.with(["ball3", "rooma"]),
		at_ball_predicate.with(["ball4", "rooma"])
	],
	new PDDLCondition([
		at_ball_predicate.with(["ball1", "roomb"]),
		at_ball_predicate.with(["ball2", "roomb"]),
		at_ball_predicate.with(["ball3", "roomb"]),
		at_ball_predicate.with(["ball4", "roomb"])
	])
);

var plan = await onlineSolver( gripper_domain.toPddlString(), gripper_problem.toPddlString() );

console.log(plan);