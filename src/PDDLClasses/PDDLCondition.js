
export default class PDDLCondition {
	/** @type {(PDDLStatement | PDDLCondition)[]} */
	statements;
	
	/**
	 * @param {(PDDLStatement | PDDLCondition)[]} statements
	 */
	constructor(statements) {
		this.statements = statements;
	}
	
	toPddlString(){
		if(this.statements.length > 1){
			return "(and "+this.statements.map((s) => s.toPddlString()).join(" ") +")";
		} else {
			return this.statements[0].toPddlString();
		}
	}
}