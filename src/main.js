import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import {astar} from "./utils/astar.js";
import {Tile, TileMap} from "./utils/Types.js";

const client = new DeliverooApi( config.host, config.token );

client.on("connect", () => {
    console.log( "socket connect", client.socket.id );
});

client.on("disconnect", () => {
    console.log( "socket disconnect", client.socket.id );
});

client.onConfig((config) => {
    console.log(config);
});


let map = new TileMap();

client.onMap(async function (width, height, tiles){
    console.log("on map")
    tiles.forEach((t) => {
        map.add(new Tile(t.x,t.y,t.delivery === true));
    });
});

let me = undefined;

client.onYou((vals) => {
    console.log("some")
    me = new Tile(vals.x,vals.y,false);
})

function heuristic(start, end) {
    const dx = Math.abs( Math.round(start.tile.x) - Math.round(end.tile.x) )
    const dy = Math.abs( Math.round(start.tile.y) - Math.round(end.tile.y) )
    return dx + dy;
}

async function agentLoop () {
    let done = false;
    while (!done) {
        if(map.tiles !== []){
            console.log(map.tiles)
            let destinations = map.tiles.filter((t) => t.destination === true);
            //console.log(destinations)
            destinations.forEach((d) => {
                let path = astar(map, me, d, heuristic);
                console.log("destin: " + d)
                console.log(path);
            })

            done = true;
        } else {
            console.log("not uer")
        }
    }
}




await agentLoop();
