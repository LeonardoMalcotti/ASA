
export default class PDDLStatement {
	predicate = "";
	/** @type {(PDDLVariable | string)[]} */
	parameters;
	negated = false;
	
	/**
	 * @param {string} predicate
	 * @param {PDDLVariable[]} parameters
	 * @param {boolean} negated
	 */
	constructor(predicate, parameters = undefined, negated = false) {
		this.predicate = predicate;
		this.negated = negated;
		if(parameters === undefined){
			this.parameters = [];
		} else {
			this.parameters = parameters;
		}
	}
	
	toPddlString(){
		return (this.negated? "(not " : "") + "("+this.predicate + " " + this.parameters.map((v) => (v instanceof PDDLVariable? v.toPddlString() : v )).join(" ")+")" + (this.negated? ")" : "");
	}
	
	/**
	 * @param {(PDDLVariable | string)[]} vars
	 */
	with(vars){
		return new PDDLStatement(this.predicate, vars);
	}
	
	not(){
		return new PDDLStatement(this.predicate,this.parameters,!this.negated);
	}
	
	/**
	 * @return {(string)[]}
	 */
	objects(){
		return this.parameters.filter((p) => !(p instanceof PDDLVariable));
	}
}