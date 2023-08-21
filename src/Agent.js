import BeliefSet from "./classes/BeliefSet.js";
import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import Executor from "./classes/Executor.js";
import DefaultIntention from "./intentions/DefaultIntention.js";

export default class Agent {
    
    /**@type {boolean} */
    #started
    
    /**@type {boolean} */
    #revision_running
    
    /**@type {DeliverooApi} */
    #apiClient

    /**@type {BeliefSet} */
    #beliefSet;
    /**@type {Intention} */
    #currentIntention;

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
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet,this.#currentIntention));
        return this.#executor.execute_plan();
    }
    
    /**
     *
     * @param {Intention} new_intention
     */
    async changePlan(new_intention){
        console.log("changePlan : new intention -> " + new_intention.description());
        this.#currentIntention = new_intention;
        this.#executor.stop_plan();
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet,this.#currentIntention));
        console.log("changePlan : plan changed");
        /*let res = await this.#executor.execute_plan();
        if(res === "completed" || res === "failed"){
            if(res === "completed"){
                this.#currentIntention.achieved = true;
            }
            this.#intentionRevision(
                this.#beliefSet,
                this.#currentIntention,
                this.#optionsGeneration,
                this.#optionsFiltering,
                this.#deliberate,
                (intention) => {
                    if (intention === undefined) console.error("execute_plan.then : passed an undefined intention");
                    this.changePlan(intention);
                }
            );
        }*/
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
        this.#currentIntention = new DefaultIntention();
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
        
        if(this.#executor.stopped && this.#executor.to_be_executed){
            this.last_plan_status = await this.#executor.execute_plan();
        }
        
        if(this.last_plan_status === "completed" || this.last_plan_status === "failed"){
            this.#currentIntention.achieved = true;
            this.#intentionRevision(
                this.#beliefSet,
                this.#currentIntention,
                this.#optionsGeneration,
                this.#optionsFiltering,
                this.#deliberate,
                this.#revision_running,
                async (intention) => {
                    this.changePlan(intention).then(() => {
                        this.loop();
                    })
                }
            );
        }
        
        if(this.last_plan_status === "invalid"){
            console.log("invalid status");
        }
    }

    async configure() {
        this.#apiClient.onYou(async (you) => {
            this.#beliefSet.me = you;
            
            if(!this.#started) {
                await this.loop();
            }
        });
        
        this.#apiClient.onConfig((config) => this.#beliefSet.config = config);

        this.#apiClient.onMap((width,height,tiles) =>
            this.#onMapCallback(width, height, tiles, this.#beliefSet)
        );

        this.#apiClient.onParcelsSensing((parcels) =>
            this.#onParcelCallback(parcels,this.#beliefSet,() => {
                this.#intentionRevision(
                    this.#beliefSet,
                    this.#currentIntention,
                    this.#optionsGeneration,
                    this.#optionsFiltering,
                    this.#deliberate,
                    this.#revision_running,
                    async (intention) => {
                        this.changePlan(intention).then(() => {
                            this.loop();
                        });
                    }
                );
            })
        );

        this.#apiClient.onAgentsSensing((agents) =>
            this.#onAgentCallback(agents,this.#beliefSet)
        );
        
    }
}