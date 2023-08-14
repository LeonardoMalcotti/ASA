/**
 * @typedef {Object} ParcelData
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {?string} carriedBy
 * @property {number} reward
 */

/**
 * @typedef {Object} AgentData
 * @property {string} id
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {number} score
 */

/**
 * @typedef {Object} TileData
 * @property {number} x
 * @property {number} y
 * @property {boolean} delivery
 */

/**
 * @typedef {Object} Configurations
 * @property {string} MAP_FILE
 * @property {string} PARCELS_GENERATION_INTERVAL
 * @property {number} PARCELS_MAX
 * @property {number} MOVEMENT_STEPS
 * @property {number} MOVEMENT_DURATION
 * @property {number} AGENTS_OBSERVATION_DISTANCE
 * @property {number} PARCELS_OBSERVATION_DISTANCE
 * @property {number} AGENT_TIMEOUT
 * @property {number} PARCEL_REWARD_AVG
 * @property {number} PARCEL_REWARD_VARIANCE
 * @property {('1s' | '2s' | '5s' | '10s' | 'infinite')} PARCEL_DECADING_INTERVAL
 * @property {number} RANDOMLY_MOVING_AGENTS
 * @property {string} RANDOM_AGENT_SPEED
 * @property {number} CLOCK
 */

/**
 * @callback OptionsGeneration
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @return {DesireSet}
 */

/**
 * @callback OptionsFiltering
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {DesireSet} desires
 * @return {DesireSet}
 */

/**
 * @callback Deliberate
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {DesireSet} desires
 * @return {Intention}
 */

/**
 * @callback IntentionRevisionCompletion
 * @param {Intention} newIntention
 * @return {void}
 */

/**
 * @callback IntentionRevision
 * @param {BeliefSet} beliefs
 * @param {Intention} currentIntention
 * @param {OptionsGeneration} optionsGeneration
 * @param {OptionsFiltering} optionsFiltering
 * @param {Deliberate} deliberate
 * @param {IntentionRevisionCompletion} completion
 * @return {void}
 */

/**
 * @callback OnMapCallback
 * @param {number} width
 * @param {number} height
 * @param {TileData[]} tiles
 * @param {BeliefSet} beliefs
 * @return {Promise<void>}
 */

/**
 * @callback OnAgentCallback
 * @param {AgentData[]} agents
 * @param {BeliefSet} beliefs
 * @return {Promise<void>}
 */

/**
 * @callback OnParcelCallback
 * @param {ParcelData[]} parcels
 * @param {BeliefSet} beliefs
 * @param {IntentionRevisionCallback} reviseIntention
 * @return {Promise<void>}
 */

/**
 * @callback OnYouCallback
 * @param {AgentData} you
 * @param {BeliefSet} beliefs
 * @return {Promise<void>}
 */

/**
 * @callback IntentionRevisionCallback
 * @return {void}
 */

export class aNode {
    tile;
    g;
    h;
    f;
    parent;
    neighbors;

    /**
     *
     * @param {Tile} tile
     * @param {number} g
     * @param {number} h
     * @param {number} f
     * @param {aNode} parent
     */
    constructor(tile, g, h, f, parent) {
        this.tile = tile;
        this.g = g;
        this.h = h;
        this.f = f;
        this.parent = parent;
    }
}