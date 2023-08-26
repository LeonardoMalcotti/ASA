
export default class PDDLVariable {
	name;
	type;
	
	/**
	 * @param {string} name
	 * @param {string} type
	 */
	constructor(name, type = undefined) {
		this.name = name;
		this.type = type;
	}
	
	toPddlString(){
		return "?" + this.name + (this.type !== undefined? " - " + this.type : "");
	}
}