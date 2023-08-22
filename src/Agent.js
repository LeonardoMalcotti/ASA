import BeliefSet from "./classes/BeliefSet.js";
import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import Executor from "./classes/Executor.js";

export default class Agent {
    
    /**@type {boolean} */
    #started
    
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
        this.#executor = new Executor(this.#apiClient,this.#beliefSet);
        this.#started = false;
    }
    
    
    /**
     * @param {Intention} new_intention
     */
   /* async changePlan(new_intention){
        console.log("revision completed");
        this.#beliefSet.revision_running = false;
        console.log("changePlan : new intention -> " + new_intention.description());
        this.#beliefSet.currentIntention = new_intention;
        await this.#executor.stop_plan();
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet));
        console.log("changePlan : plan changed");
    }*/
    
    /**
     * @param {Intention} new_intention
     */
    async changePlan2(new_intention){
        console.log("revision completed");
        this.#beliefSet.revision_running = false;
        console.log("changePlan : new intention -> " + new_intention.description());
        this.#beliefSet.currentIntention = new_intention;
        await this.#executor.stop_plan2();
        this.#executor.set_new_plan2(await this.#planner(this.#beliefSet));
        console.log("changePlan : plan changed");
    }
    
    /*
    async loop(){
        console.log("Loop called");
        if(this.#beliefSet.currentIntention.status === "executing") {
            console.log("Loop : current plan still in execution");
            return;
        }
        
        //this.#revision_running = false;
        if (this.#executor.stopped === true && this.#executor.to_be_executed === true){
            this.#beliefSet.currentIntention.status = "executing";
            this.#executor.execute_plan().then((r) => {
                console.log("then : "+r);
                this.#beliefSet.currentIntention.status = r;
            }).catch((r) => {
                console.log("catched : "+r);
                this.#beliefSet.currentIntention.status = r;
            });
       }
        
        if (this.#beliefSet.currentIntention.status === "completed" ||
            this.#beliefSet.currentIntention.status === "failed") {
            await this.revision();
        }
        
        if(this.#beliefSet.currentIntention.status === "invalid"){
            console.log("invalid status");
        }
    }
    */
    
    async loop2() {
        while(true){
            if(this.#executor.status !== "executing" && this.#started){
                console.log("Loop2 : " + this.#executor.status);
                this.#beliefSet.currentIntention.status = this.#executor.status;
                
                if (this.#beliefSet.currentIntention.status === "completed" ||
                    this.#beliefSet.currentIntention.status === "failed") {
                    console.log("Loop2 : calling revision " + this.#executor.status);
                    await this.revision2();
                }
                
                if(this.#beliefSet.currentIntention.status === "invalid"){
                    console.log("invalid status");
                }
            }
            await new Promise((r) => {setTimeout(r)});
        }
    }
    
    async revision(){
        await this.#intentionRevision(
            this.#beliefSet,
            this.#optionsGeneration,
            this.#optionsFiltering,
            this.#deliberate,
            async (intention) => {
                this.changePlan(intention).then(() => {this.loop()});
            }
        );
    }
    
    async revision2(){
        await this.#intentionRevision(
            this.#beliefSet,
            this.#optionsGeneration,
            this.#optionsFiltering,
            this.#deliberate,
            (intention) => {
                this.changePlan2(intention);
               // this.changePlan(intention).then(() => {this.loop()});
            }
        );
    }

    async configure() {
        
        this.#apiClient.onYou((you) => {
            this.#beliefSet.me = you;
            if(!this.#started) {
                console.log("starting")
                this.#started = true;
                this.changePlan2(this.#beliefSet.currentIntention);
                /*this.changePlan(this.#beliefSet.currentIntention).then(() => {
                    this.loop();
                });*/
            }
        });
        
        this.#apiClient.onConfig((config) => this.#beliefSet.config = config);

        this.#apiClient.onMap((width,height,tiles) =>
            this.#onMapCallback(width, height, tiles, this.#beliefSet)
        );

        this.#apiClient.onParcelsSensing((parcels) =>
            this.#onParcelCallback(parcels,this.#beliefSet,() => {
                this.revision2();
            })
        );

        this.#apiClient.onAgentsSensing((agents) =>
            this.#onAgentCallback(agents,this.#beliefSet)
        );
        
        this.loop2();
        this.#executor.action_loop();
    }
}