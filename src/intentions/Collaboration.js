import {Intention} from "./Intention.js";
import Ask from "../actions/Ask.js";

export class Collaboration extends Intention {
	/** @type {string} */
	ally;
	
	/**
	 * @param {string} ally
	 */
	constructor(ally) {
		super();
		this.ally = ally;
	}
	
	
	async achievable(beliefs) {
		let res = await(new Ask(this.ally,
			{
				topic: "Collaborating?",
				token: beliefs.communication_token
			})).execute(beliefs);
		
		return !(res === false || res === "No");
	}
}