
export default class PDDLDomain {
	domain;
	requirements;
	/** @type {PDDLStatement[]} */
	predicates = [];
	/** @type {PDDLAction[]} */
	actions = [];
	/** @type {string[]} */
	types;
	
	/**
	 * @param {string} domain
	 * @param {PDDLStatement[]} predicates
	 * @param {PDDLAction[]} actions
	 * @param {string[]} types
	 */
	constructor(domain,predicates, actions, types = []) {
		this.domain = domain;
		this.requirements = ["strips" , "typing"];
		this.predicates = predicates;
		this.actions = actions;
		this.types = types;
	}
	
	toPddlString(){
		let domain_str = "(domain "+ this.domain + ")";
		let type_str = this.types.length !== 0 ? "(:types " + this.types.join(" ") + ")" : "";
		let requirement_str = "(:requirements " + this.requirements.map((r) => ":"+r).join(" ") +")";
		let predicates_str = "(:predicates " + this.predicates.map((p) => p.toPddlString()).join(" ")+")";
		let actions_str = this.actions.map((a) => a.toPddLString()).join(" ");
		return "(define " + domain_str + " " + requirement_str + " " + type_str + " " + predicates_str + " " + actions_str + ")";
	}
}