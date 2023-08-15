
export default class Plan {
	/**
	 * @type {Action []}
	 */
	actions;

	constructor() {
		this.actions = [];
	}

	/**
	 * @param {Action} action
	 */
	addAction(action){
		this.actions.push(action);
	}
}