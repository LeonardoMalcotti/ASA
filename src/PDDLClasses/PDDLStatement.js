import PDDLVariable from "./PDDLVariable.js";

export default class PDDLStatement {
	predicate = "";
	/** @type {(PDDLVariable | string)[]} */
	parameters;
	parameters_type = [];
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
			this.parameters_type = parameters.map((p) => p.type);
		}
	}
	
	toPddlString(notype = false){
		return (this.negated? "(not " : "") + "("+this.predicate + " " + this.parameters.map((v) => (v instanceof PDDLVariable? v.toPddlString(notype) : v )).join(" ")+")" + (this.negated? ")" : "");
	}
	
	/**
	 * @param {(PDDLVariable | string)[]} vars
	 */
	with(vars){
		let ret = new PDDLStatement(this.predicate, vars);
		ret.parameters_type = this.parameters_type;
		return ret;
	}
	
	not(){
		let ret =new PDDLStatement(this.predicate,this.parameters,!this.negated);
		ret.parameters_type = this.parameters_type;
		return ret;
	}
	
	/**
	 * @return {(string)[]}
	 */
	objects(){
		let obj = this.parameters.filter((p) => !(p instanceof PDDLVariable));
		if(this.parameters_type.length !== 0){
			obj = obj.map((o,i) => o + " - " + this.parameters_type[i]);
		}
		return obj;
	}
}