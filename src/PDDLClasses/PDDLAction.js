
export default class PDDLAction {
	action = "";
	/** @type {PDDLVariable[]} */
	parameters = [];
	/** @type {PDDLCondition} */
	preconditions ;
	/** @type {PDDLCondition} */
	effect;
	
	/**
	 * @param {string} action
	 * @param {PDDLVariable[]} parameters
	 * @param {PDDLCondition} preconditions
	 * @param {PDDLCondition} effect
	 */
	constructor(action, parameters, preconditions, effect) {
		this.action = action;
		this.parameters = parameters;
		this.preconditions = preconditions;
		this.effect = effect;
	}
	
	toPddLString(){
		let action_str = ":action " + this.action;
		let parameter_str = ":parameters (" + this.parameters.map((p) => p.toPddlString()).join(" ") + ")";
		let precondition_str = ":precondition " + this.preconditions.toPddlString(true);
		let effect_str = ":effect " + this.effect.toPddlString(true);
		
		return "("+action_str + " " + parameter_str + " " + precondition_str + " " + effect_str + ")";
	}
	
}