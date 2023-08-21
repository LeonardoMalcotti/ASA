import BeliefSet from "./classes/BeliefSet.js";
import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import Executor from "./classes/Executor.js";
import DefaultIntention from "./intentions/DefaultIntention.js";

export default class Agent {
    
    /**@type {boolean} */
    #started
    
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

    /**
     *
     * @param {Intention} new_intention
     */
    async changePlan(new_intention){
        console.log("called changePlan")
        console.log(new_intention);
        // stop execution
        // create new plan from current intention
        // start new execution given new plan
        this.#currentIntention = new_intention;
        this.#executor.stop_plan();
        this.#executor.set_new_plan(await this.#planner(this.#beliefSet,this.#currentIntention));
        this.#executor.execute_plan().then((res) => {
            if(res === true) {
                this.#intentionRevision(
                    this.#beliefSet,
                    this.#currentIntention,
                    this.#optionsGeneration,
                    this.#optionsFiltering,
                    this.#deliberate,
                    (intention) => {
                        this.changePlan(intention);
                    }
                );
            }
        })
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
    }

    configure() {
        this.#apiClient.onYou((you) => {
            this.#beliefSet.me = you;
            if(!this.#started) {
                this.#started = true;
                this.changePlan(this.#currentIntention);
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
                    async (intention) => {
                        await this.changePlan(intention);
                    }
                );
            })
        );

        this.#apiClient.onAgentsSensing((agents) =>
            this.#onAgentCallback(agents,this.#beliefSet)
        );
    }
}