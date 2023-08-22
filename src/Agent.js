import BeliefSet from "./classes/BeliefSet.js";
import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import Executor from "./classes/Executor.js";

export default class Agent {
    
    /**@type {boolean} */
    #started
    
    /**@type {boolean} */
    #revision_running
    
    /**@type {DeliverooApi} */
    #apiClient

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
    
    async start(){
        this.#started = true;
        this.#executor.stop_plan();
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet));
        return this.#executor.execute_plan();
    }
    
    /**
     *
     * @param {Intention} new_intention
     */
    async changePlan(new_intention){
        console.log("changePlan : new intention -> " + new_intention.description());
        this.#beliefSet.currentIntention = new_intention;
        this.#executor.stop_plan();
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet));
        console.log("changePlan : plan changed");
    }

    /**
     * @param {OnMapCallback} onMapCallback
     * @param {OnAgentCallback} onAgentCallback
     * @param {OnParcelCallback} onParcelCallback
     * @param {OptionsGeneration} optionsGeneration
     * @param {OptionsFiltering} optionsFiltering
     * @param {Deliberate} deliberate
     * @param {IntentionRevision} intentionRevision
     * @param {Planner} planner
     */
    constructor(onMapCallback,
                onAgentCallback,
                onParcelCallback,
                optionsGeneration,
                optionsFiltering,
                deliberate,
                intentionRevision,
                planner) {

        this.#apiClient = new DeliverooApi( config.host, config.token );
        this.#beliefSet = new BeliefSet();
        this.#onMapCallback = onMapCallback;
        this.#onAgentCallback = onAgentCallback;
        this.#onParcelCallback = onParcelCallback;
        this.#optionsGeneration = optionsGeneration;
        this.#optionsFiltering = optionsFiltering;
        this.#deliberate = deliberate;
        this.#intentionRevision = intentionRevision;
        this.#planner = planner;
        this.#executor = new Executor(this.#apiClient);
        this.#started = false;
        this.#revision_running = false;
    }
    
    last_plan_status = "None";
    
    async loop(){
        this.#revision_running = false;
        if(this.#executor.stopped && this.#executor.to_be_executed){
            this.last_plan_status = await this.#executor.execute_plan();
        }
        
        if(this.last_plan_status === "completed" || this.last_plan_status === "failed"){
            this.#beliefSet.currentIntention.achieved = true;
            this.revision();
        }
        
        if(this.last_plan_status === "invalid"){
            console.log("invalid status");
        }
    }
    
    revision(){
        this.#intentionRevision(
            this.#beliefSet,
            this.#optionsGeneration,
            this.#optionsFiltering,
            this.#deliberate,
            this.#revision_running,
            async (intention) => {
                this.changePlan(intention).then(() => {
                    this.loop();
                })
            }
        ).then(()=>{
            console.log("revision finished");
            this.#revision_running = false;
        });
    }

    async configure() {
        this.#apiClient.onYou(async (you) => {
            this.#beliefSet.me = you;
            
            if(!this.#started) {
                console.log("starting")
                this.#started = true;
                this.changePlan(this.#beliefSet.currentIntention).then(() => {
                    this.loop();
                });
            }
        });
        
        this.#apiClient.onConfig((config) => this.#beliefSet.config = config);

        this.#apiClient.onMap((width,height,tiles) =>
            this.#onMapCallback(width, height, tiles, this.#beliefSet)
        );

        this.#apiClient.onParcelsSensing((parcels) =>
            this.#onParcelCallback(parcels,this.#beliefSet,() => {
                this.revision();
            })
        );

        this.#apiClient.onAgentsSensing((agents) =>
            this.#onAgentCallback(agents,this.#beliefSet)
        );
        
    }
}