
export default class Plan {
	/**
	 * @type {Action []}
	 */
	actions;

	constructor() {
		this.actions = [];
	}
	
	
	nextAction(){
		if(this.actions.length !== 0){
			return this.actions[0];
		} else {
			return undefined;
		}
	}
}