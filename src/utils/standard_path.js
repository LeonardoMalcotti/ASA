/**
 * @param {BeliefSet} beliefs
 * @return {Tile[]}
 */
export default function calculate_random_path(beliefs){
	/** @type {Tile[]} */
	let visited = [];
	
	let map = beliefs.mapBeliefs.tiles.map((x) => x);
	let my_position = beliefs.my_position();
	let last_tile = map.find((t) => t.x === my_position.x && t.y === my_position.y);
	visited.push(last_tile);
	let done = false;
	
	while (!done){
		/** @type {Tile[]} */
		let to_visit = [];
		
		// push to the list of "to be visited" tiles the neighbors tile of the last visited tiles
		// minus the ones which have been already visited.
		neighbors(last_tile,map).forEach((t) => {
			if(visited.find(t) === undefined){
				to_visit.push(t);
			}
		});
		
		if(to_visit.length === 0){
			done = true;
			continue;
		}
		
		let next_tile = to_visit[Math.floor(Math.random() * (2*to_visit.length))];
		visited.push(next_tile);
	}
	
	return visited;
}

/**
 * @param {Tile} tile
 * @param {Tile[]} map
 */
function neighbors(tile, map){
	return map.filter((t) => (
		t.x === tile.x && t.y + 1 === tile.y ||
		t.x === tile.x && t.y - 1 === tile.y ||
		t.x + 1 === tile.x && t.y === tile.y ||
		t.x - 1 === tile.x && t.y === tile.y
	))
}