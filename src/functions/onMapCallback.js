/**
 * @param {number} width
 * @param {number} height
 * @param {TileData[]} tiles
 * @param {BeliefSet} beliefs
 * @return {Promise<void>}
 */
export async function onMapCallback_simple(width, height, tiles, beliefs) {
    tiles.forEach((t) => {
        beliefs.mapBeliefs.add(new Tile(t.x, t.y, t.delivery === true));
    });
}