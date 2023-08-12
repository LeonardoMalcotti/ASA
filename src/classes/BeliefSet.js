import {TileMap} from "./TileMap.js";

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

    constructor() {
        this.mapBeliefs = new TileMap();
        this.agentBeliefs = [];
        this.parcelBeliefs = [];
        this.me = {};
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
     * @param {AgentBelief} agent
     */
    deleteAgentBelief(agent){
        this.agentBeliefs.splice(this.agentBeliefs.indexOf(agent),1);
    }
}