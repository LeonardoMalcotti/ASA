import {Intention} from "./Intention.js";

export default class DefaultIntention extends Intention{

	async achievable(beliefs) {
		return true;
	}
	
	description() {
		return this.constructor.name;
	}
	
	
	hash() {
		return "Default";
	}
}