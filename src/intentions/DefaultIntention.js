import {Intention} from "./Intention.js";

export default class DefaultIntention extends Intention{

	async achievable(beliefs) {
		return super.achievable(beliefs);
	}
}