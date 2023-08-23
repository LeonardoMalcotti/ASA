import {aNode} from "./Types.js";
import {Tile} from "../classes/Tile.js";
import {TileMap} from "../classes/TileMap.js";
import {same_position} from "./Utils.js";

/**
 * @param {Tile} t1
 * @param {Tile} t2
 * @return {boolean}
 */
function sameTile(t1,t2){
    return t1.x === t2.x && t1.y === t2.y;
}

/**
 * @param {aNode} node
 * @param {TileMap} map
 * @param {aNode[]} a_map
 */
function get_aNode_neighbors(node, map, a_map) {
    const neigh = map.neighbors(node.tile);
    return a_map.filter((a) => {
        return neigh.find((t) => sameTile(t,a.tile));
    });
}

function heuristic(start, end) {
    const dx = Math.abs( Math.round(start.x) - Math.round(end.x) )
    const dy = Math.abs( Math.round(start.y) - Math.round(end.y) )
    return dx + dy;
}

/**
 *
 * @param {TileMap} map
 * @param {Tile} start
 * @param {Tile} goal
 * @param {function (Tile,Tile):number} heuristic
 * @return { Promise<Tile[]>}
 */
export async function astar(map,start,goal,heuristic){


    const NodeMap = map.tiles.map((t) => {
        const g = (sameTile(start,t)) ? 0 : Number.MAX_VALUE;
        const h = heuristic(t,goal);
        const f = g + h;
        return new aNode(t, g, h, f, undefined);
    })

    const comparator = (a, b) => a.f - b.f;

    const open = [ new aNode(start, 0, heuristic(start,goal), heuristic(start,goal),undefined) ]

    const closed = [];


    while(open.length > 0){
        let current = open.sort(comparator)[0];
        if(current.h === 0){
            let temp = current;
            let path = [];
            path.push(temp.tile);
            while (temp.parent !== undefined) {
                path.push(temp.parent.tile);
                temp = temp.parent;
            }
            return path.reverse();
        }

        closed.push(open[0]);
        open.splice(0,1);

        for (let neighbor of get_aNode_neighbors(current, map, NodeMap)){
            //console.log(neighbor)
            let possible_g = current.g + 1;
            let possible_h = heuristic(neighbor.tile,goal);

            // if the node has not been visited yet
            if(!closed.find((node) => sameTile(node.tile,neighbor.tile))){

                // if it isn't even in the open list add it
                let i = open.findIndex((t) => sameTile(t.tile,neighbor.tile));
                if(i === -1){
                    neighbor.parent = current;
                    open.push(neighbor)
                } else if (possible_g < neighbor.g) {

                    open[i].g = possible_g;
                    open[i].h = possible_h;
                    open[i].f = neighbor.g + neighbor.h;
                    open[i].parent = current;

                    let j = NodeMap.findIndex((t) => sameTile(t.tile,neighbor.tile));
                    NodeMap[j] = open[i];
                }
            }
        }
    }

    return [];
}


/**
 *
 * @param {BeliefSet} beliefs
 * @param {Position} from
 * @param {Position} to
 */
export async function calculate_path(beliefs, from, to){
    let map = beliefs.mapBeliefs;
    let start = Tile.fromPosition(from);
    let end = Tile.fromPosition(to);
    return astar(map,start,end,heuristic);
}

/**
 *
 * @param {BeliefSet} beliefs
 * @param {Position} from
 * @param {Position} to
 */
export async function calculate_path_considering_nearby_agents(beliefs, from, to){
    let map = beliefs.mapBeliefs.copy();
    
    let nearby_agents_position = beliefs.agentBeliefs.filter((a) => a.probability > 0.8).map((a) => a.position);
    nearby_agents_position.forEach((p) => {
        map.tiles.splice(map.tiles.findIndex((t) => same_position(t.toPosition(),p)),1);
        map.delivery_tiles.splice(map.delivery_tiles.findIndex((t) => same_position(t.toPosition(),p)),1);
    });
    
    let start = Tile.fromPosition(from);
    let end = Tile.fromPosition(to);
    return astar(map,start,end,heuristic);
}