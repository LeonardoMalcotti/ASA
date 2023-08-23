import BeliefSet from "../classes/BeliefSet.js";
import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../../config.js";
import ContinuousExecutor from "../executor/ContinuousExecutor.js";

export default class Agent {
	
	/**@type {boolean} */
	#started;
	/**@type {boolean} */
	#abort;
	
	/**@type {DeliverooApi} */
	#apiClient;
	
	/**@type {BeliefSet} */
	#beliefSet;
	
	/**@type {OnMapCallback} */
	#onMapCallback;
	/**@type {OnAgentCallback} */
	#onAgentCallback;
	/**@type {OnParcelCallback} */
	#onParcelCallback;
	
	/**@type {OptionsGeneration} */
	#optionsGeneration;
	/**@type {OptionsFiltering}*/
	#optionsFiltering;
	/**@type {Deliberate}*/
	#deliberate;
	/**@type {IntentionRevision} */
	#intentionRevision;
	/**@type {Planner} */
	#planner;
	/**@type {Executor} */
	#executor;
	
	/**
	 * @param {OnMapCallback} onMapCallback
	 * @param {OnAgentCallback} onAgentCallback
	 * @param {OnParcelCallback} onParcelCallback
	 * @param {OptionsGeneration} optionsGeneration
	 * @param {OptionsFiltering} optionsFiltering
	 * @param {Deliberate} deliberate
	 * @param {IntentionRevision} intentionRevision
	 * @param {Planner} planner
	 * @param {string} token
	 */
	constructor(onMapCallback,
	            onAgentCallback,
	            onParcelCallback,
	            optionsGeneration,
	            optionsFiltering,
	            deliberate,
	            intentionRevision,
	            planner,
	            token = undefined) {
		if(token === undefined){
			this.#apiClient = new DeliverooApi( config.host, config.token );
		} else {
			this.#apiClient = new DeliverooApi( config.host, token );
		}
		this.#beliefSet = new BeliefSet();
		this.#onMapCallback = onMapCallback;
		this.#onAgentCallback = onAgentCallback;
		this.#onParcelCallback = onParcelCallback;
		this.#optionsGeneration = optionsGeneration;
		this.#optionsFiltering = optionsFiltering;
		this.#deliberate = deliberate;
		this.#intentionRevision = intentionRevision;
		this.#planner = planner;
		this.#executor = new ContinuousExecutor(this.#apiClient, this.#beliefSet);
		this.#started = false;
		this.#abort = false;
	}
	
	/**
	 * @param {Intention} new_intention
	 */
	async changePlan(new_intention){
		console.log("revision completed");
		this.#beliefSet.revision_running = false;
		console.log("changePlan : new intention -> " + new_intention.description());
		this.#beliefSet.currentIntention = new_intention;
		await this.#executor.stop_plan();
		this.#executor.set_new_plan(await this.#planner(this.#beliefSet));
		console.log("changePlan : plan changed");
	}
	
	async revision(){
		await this.#intentionRevision(
			this.#beliefSet,
			this.#optionsGeneration,
			this.#optionsFiltering,
			this.#deliberate,
			(intention) => {
				this.changePlan(intention);
			}
		);
	}
	
	async loop() {
		while(this.#abort === false){
			if(this.#executor.status !== "executing" && this.#started){
				this.#beliefSet.currentIntention.status = this.#executor.status;
				
				if (this.#beliefSet.currentIntention.status === "completed" ||
					this.#beliefSet.currentIntention.status === "failed") {
					console.log("Loop : calling revision " + this.#executor.status);
					await this.revision();
				}
				
				if(this.#beliefSet.currentIntention.status === "invalid"){
					console.log("invalid status");
				}
			}
			await new Promise((r) => {setTimeout(r)});
		}
		console.log("Agent Loop aborted");
	}
	
	abort_execution(){
		console.log("Aborting");
		this.#abort = true;
		this.#executor.abort_execution();
		this.#apiClient.socket.disconnect();
	}
	
	async configure(end_after = 0) {
		
		this.#apiClient.onYou((you) => {
			this.#beliefSet.me = you;
			if(!this.#started) {
				console.log("starting")
				this.#started = true;
				this.changePlan(this.#beliefSet.currentIntention);
			}
		});
		
		this.#apiClient.onConfig((config) => this.#beliefSet.config = config);
		this.#apiClient.onMap((width,height,tiles) => this.#onMapCallback(width, height, tiles, this.#beliefSet));
		this.#apiClient.onParcelsSensing((parcels) => this.#onParcelCallback(parcels,this.#beliefSet,() => {this.revision();}));
		this.#apiClient.onAgentsSensing((agents) => this.#onAgentCallback(agents,this.#beliefSet));
		
		this.#apiClient.onDisconnect(() => console.log("Disconnecting ..."));
		
		if(end_after > 0){
			setTimeout(() => this.abort_execution(), end_after);
		}
		
		this.loop();
		this.#executor.action_loop();
	}
}