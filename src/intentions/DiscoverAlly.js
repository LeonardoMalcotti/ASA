import {Intention} from "./Intention.js";

export default class DiscoverAlly extends Intention {
	
	constructor() {
		super();
		this.possible_reward = Number.MAX_VALUE;
	}
	
	async achievable(beliefs) {
		return beliefs.allies.length === 0;
	}
	
	description() {
		return this.constructor.name;
	}
	
	hash() {
		return this.constructor.name;
	}
}