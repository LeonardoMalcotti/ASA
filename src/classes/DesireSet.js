import {Intention} from "../intentions/Intention.js";

export default class DesireSet {

    /** The list of possible intentions that the agent would desire to accomplish.
     * @type {Intention[]} intentions
     */
    intentions;

    constructor() {
        this.intentions = [];
    }

    /**
     * @param {Intention} intention
     */
    add_intention(intention){
        if(! intention instanceof Intention) return;
        this.intentions.push(intention);
    }

    /**
     * @param {Intention} intention
     */
    remove_intention(intention){
        if(! intention instanceof Intention) return;
        let i = this.intentions.indexOf(intention);
        if(i !== -1){
            this.intentions.splice(i,1);
        }
    }

}