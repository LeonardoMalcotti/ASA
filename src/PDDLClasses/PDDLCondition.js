
export default class PDDLCondition {
	/** @type {(PDDLStatement | PDDLCondition)[]} */
	statements;
	disjunctive;
	/**
	 * @param {(PDDLStatement | PDDLCondition)[]} statements
	 * @param {boolean} disjunctive
	 */
	constructor(statements, disjunctive = false) {
		this.statements = statements;
		this.disjunctive = disjunctive;
	}
	
	toPddlString(notype = false){
		if(this.statements.length > 1){
			if(!this.disjunctive){
				return "(and "+this.statements.map((s) => s.toPddlString(notype)).join(" ") +")";
			} else {
				return "(or "+this.statements.map((s) => s.toPddlString(notype)).join(" ") +")";
			}
		} else {
			return this.statements[0].toPddlString(notype);
		}
	}
}