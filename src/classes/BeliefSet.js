import {TileMap} from "./TileMap.js";
import Position from "./Position.js";
import DefaultIntention from "../intentions/DefaultIntention.js";
import Plan from "../actions/Plan.js";
import DiscoverAlly from "../intentions/DiscoverAlly.js";
import ParcelBelief from "./ParcelBelief.js";
import AgentBelief from "./AgentBelief.js";

export default class BeliefSet {

    /** @type {Configurations} */
    config;
    /** @type {AgentData} */
    me;
    /** @type {TileMap} */
    mapBeliefs;
    /** @type {AgentBelief[]} */
    agentBeliefs;
    /** @type {ParcelBelief[]} */
    parcelBeliefs;
    /**@type {Intention} */
    currentIntention;
    /** @type {boolean} */
    revision_running;
    /** @type {Ally[]} */
    allies;
    /** @type {string} */
    communication_token;
    /** @type {Plan} */
    currentPlan;

    constructor() {
        this.mapBeliefs = new TileMap();
        this.agentBeliefs = [];
        this.parcelBeliefs = [];
        this.me = {};
        this.currentIntention = new DiscoverAlly();
        this.revision_running = false;
        this.allies = [];
        this.communication_token = undefined;
        this.currentPlan = new Plan();
    }

    /**
     * @param {string} id the id of the parcel to get.
     * @return {(ParcelBelief | undefined)}
     */
    getParcelBelief(id) {
        return this.parcelBeliefs.find((p) => p.id === id);
    }
    
    /**
     * @param {ParcelData[]} parcels
     */
    async updateParcelBeliefs(parcels){
       for(let p of parcels){
           let current_belief = this.getParcelBelief(p.id);
           if(current_belief === undefined){
               this.parcelBeliefs.push(ParcelBelief.fromParcelData(p));
           } else {
               if(current_belief.probability < 1){
                   this.deleteParcelBelief(current_belief);
                   this.parcelBeliefs.push(ParcelBelief.fromParcelData(p));
               }
           }
       }
    }
    
    /**
     * @param {AgentData[]} agents
     */
    async updateAgentBeliefs(agents){
        for(let a of agents){
            let current_belief = this.getAgentBelief(a.id);
            if(current_belief === undefined){
                this.agentBeliefs.push(AgentBelief.fromAgentData(a));
            } else {
                if(current_belief.probability < 1){
                    this.deleteAgentBelief(current_belief);
                    this.agentBeliefs.push(AgentBelief.fromAgentData(a));
                }
            }
        }
    }

    /**
     * @param {string} id the id of the agent to get.
     */
    getAgentBelief(id) {
        return this.agentBeliefs.find((a) => a.id === id);
    }

    /**
     * @method
     * @param {ParcelBelief} parcel
     */
    deleteParcelBelief(parcel){
        this.parcelBeliefs.splice(this.parcelBeliefs.indexOf(parcel),1);
    }
    
    /**
     * @method
     * @param {string} id
     */
    deleteParcelBeliefById(id){
        this.deleteParcelBelief(this.parcelBeliefs.find((p) => p.id === id));
    }

    /**
     * @method
     * @param {AgentBelief} agent
     */
    deleteAgentBelief(agent){
        this.agentBeliefs.splice(this.agentBeliefs.indexOf(agent),1);
    }

    /**
     * @return {Position}
     */
    my_position(){
        return new Position(Math.round(this.me.x),Math.round(this.me.y));
    }
}