
export default class PDDLVariable {
	name;
	type;
	
	/**
	 * @param {string} name
	 * @param {string} type
	 */
	constructor(name, type = "") {
		this.name = name;
		this.type = type;
	}
	
	toPddlString(notype = false){
		return "?" + this.name + ((this.type !== "" && !notype)? " - " + this.type : "");
	}
}