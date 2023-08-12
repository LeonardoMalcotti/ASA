/**
 * @class Intention
 * @property {string} category
 */
export class Intention {
    category;

    /**
     * @param {string} category
     */
    constructor(category) {

        this.category = category;
    }
}


/**
 * @class BasicIntention
 * @extends Intention
 */
export class BasicIntention extends Intention{
    constructor() {
        super("basic");
    }
}


/**
 * @class ComplexIntention
 * @extends Intention
 * @property {BasicIntention[]} intentionQueue
 */
export class ComplexIntention extends Intention{
    /**@type {BasicIntention[]} */
    intentionQueue;

    constructor() {
        super("complex");
        this.intentionQueue = [];
    }
}


/**
 * @class Explore
 * @extends BasicIntention
 */
export class DefaultIntention extends Intention {

}


/**
 * @class GoTo
 * @extends BasicIntention
 * @property {Position} position
 */
export class GoTo extends BasicIntention {
    /**
     * @param {Position} position
     */
    constructor(position) {
        super();
        this.position = position;
    }
}


/**
 * @class PickUp
 * @extends BasicIntention
 * @property {string[]} parcels
 */
export class PickUp extends BasicIntention {
    /**
     * @param {string[]} parcels
     */
    constructor(parcels) {
        super();
        this.parcel = parcels;
    }
}


/**
 * @class PutDown
 * @extends BasicIntention
 * @property {string[]} parcels
 */
export class PutDown extends BasicIntention {
    /**
     * @param {string[]} parcels
     */
    constructor(parcels) {
        super();
        this.parcel = parcels;
    }
}