export default class IntentionBelief {
    /**
     *
     * @param {string} type
     * @param {string} parcel
     * @param {Destination} destination
     */
    constructor(type, parcel, destination) {
        this.type = type;
        this.parcel = parcel;
        this.destination = destination;
    }
}