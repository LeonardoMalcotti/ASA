/**
 * @param {aNode} node
 * @param {TileMap} map
 * @param {aNode[]} a_map
 */
function get_aNode_neighbors(node, map, a_map) {
    const neigh = map.neighbors(node.tile);

    return a_map.filter((a) => {
        return a.tile in neigh;
    });
}

/**
 *
 * @param {TileMap} map
 * @param {Tile} start
 * @param {Tile} goal
 * @param h
 * @returns {Tile[]}
 */
export async function astar(map,start,goal,h){


    const NodeMap = map.tiles.map((t) => {
        const g = (start === t) ? 0 : Number.MAX_VALUE;
        const h = h(t,goal);
        const f = g + h;
        return new aNode(t, g, h, f, undefined);
    })

    const comparator = (a, b) => a.f - b.f;

    const open = [ new aNode(start, 0, h(start,goal), h(start,goal),undefined) ]

    const closed = [];


    while(open.size() > 0){
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

            let possible_g = current.g + 1;
            let possible_h = h(neighbor.tile,goal);

            if(! neighbor in closed){

                let i = open.findIndex((t) => t.tile === neighbor.tile);

                if(i === -1){
                    open.push(neighbor)
                } else if (possible_g < neighbor.g) {

                    open[i].g = possible_g;
                    open[i].h = possible_h;
                    open[i].f = neighbor.g + neighbor.h;
                    open[i].parent = current;

                    let j = NodeMap.findIndex((t) => t.tile === neighbor.tile);
                    NodeMap[j] = open[i];
                }
            }
        }
    }
}