/**
 * @param {BeliefSet} beliefs
 * @return {Tile[]}
 */
export default async function calculate_random_path(beliefs){
	
	/** @type {Tile[]} */
	let visited = [];
	
	let map = beliefs.mapBeliefs.tiles.map((x) => x);
	let my_position = beliefs.my_position();
	let last_tile = map.find((t) => t.x === my_position.x && t.y === my_position.y);
	visited.push(last_tile);
	let done = false;
	
	while (done === false){
		/** @type {Tile[]} */
		let to_visit = neighbors(last_tile,map).filter((t) =>{
			return !visited.find((tt) => t.x === tt.x && t.y === tt.y);
		})
		
		if(to_visit.length === 0){
			done = true;
			continue;
		}
		
		let rnd = Math.floor(Math.random() * (to_visit.length));
		last_tile = to_visit[rnd];
		visited.push(last_tile);
	}
	
	return visited;
}

/**
 * @param {Tile} tile
 * @param {Tile[]} map
 * @return {Tile[]}
 */
function neighbors(tile, map){
	return map.filter((t) => (
		(t.x === tile.x && t.y + 1 === tile.y) ||
		(t.x === tile.x && t.y - 1 === tile.y) ||
		(t.x + 1 === tile.x && t.y === tile.y) ||
		(t.x - 1 === tile.x && t.y === tile.y)
	));
}