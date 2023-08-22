import {TileMap} from "./TileMap.js";
import Position from "./Position.js";
import DefaultIntention from "../intentions/DefaultIntention.js";

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

    constructor() {
        this.mapBeliefs = new TileMap();
        this.agentBeliefs = [];
        this.parcelBeliefs = [];
        this.me = {};
        this.currentIntention = new DefaultIntention();
    }

    /**
     * @param {string} id the id of the parcel to get.
     * @return {(ParcelBelief | undefined)}
     */
    getParcelBelief(id) {
        return this.parcelBeliefs.find((p) => p.id === id);
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