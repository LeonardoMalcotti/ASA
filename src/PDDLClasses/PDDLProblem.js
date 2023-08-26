
export default class PDDLProblem {
	/** @type {string} */
	problem;
	/** @type {string} */
	domain;
	/** @type {string[]} */
	objects;
	/** @type {PDDLStatement[]} */
	init;
	/** @type {PDDLCondition} */
	goal;
	
	/**
	 * @param {string} problem
	 * @param {string} domain
	 * @param {PDDLStatement[]} init
	 * @param {PDDLCondition} goal
	 */
	constructor(problem, domain, init, goal) {
		this.domain = domain;
		this.init = init;
		this.goal = goal;
		this.objects = [];
		init.map((i) => i.objects())
			.forEach((i) => i.forEach((o)=>{
				if(!this.objects.find((x) => x === o)) this.objects.push(o);
			}));
	}
	
	toPddlString(){
		let problem_str = "(problem " + this.problem + ")";
		let domain_str = "(:domain " +this.domain + ")";
		let objects_str = "(:objects " + this.objects.join(" ") + ")";
		let init_str = "(:init " + this.init.map((i) => i.toPddlString()).join(" ") + ")";
		let goal_str = "(:goal " + this.goal.toPddlString() + ")";
		
		return "(define " + problem_str + " " + domain_str + " " + objects_str + " " + init_str + " " + goal_str + ")";
	}
}