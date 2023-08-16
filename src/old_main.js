import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";
import {astar} from "./utils/astar.js";

const client = new DeliverooApi( config.host, config.token );

client.on("connect", async () => {
    console.log( "socket connect", client.socket.id );
});

client.on("disconnect",async () => {
    console.log( "socket disconnect", client.socket.id );
});

client.onConfig(async (config) => {
    console.log(config);
});


let map = new TileMap();

client.onMap(async function (width, height, tiles){
    console.log("on map")
    tiles.forEach((t) => {
        map.add(new Tile(t.x,t.y,t.delivery === true));
        //console.log(map.tiles)
    });
    //console.log(map.tiles);
});

let me = undefined;

client.onYou(async (vals) => {
    console.log("some")
    me = new Tile(vals.x,vals.y,false);
    console.log("my position " + me.x + " " + me.y);
    if(map.tiles.length > 0){

        let destinations = map.tiles.filter((t) => t.destination === true);
        console.log("destinations")
        console.log(destinations)
        /*
        for(let d of destinations){
            computeDistance(d).then((value) => {

                    console.log("to " + d.x + " " + d.y);
                    console.log(value);

            })
        }*/
        let d = destinations[0];
        computeDistance(d).then((value) => {

            console.log("to " + d.x + " " + d.y);
            console.log(value);

        })

    }
})

client.onParcelsSensing(async function(params))

function heuristic(start, end) {
    const dx = Math.abs( Math.round(start.x) - Math.round(end.x) )
    const dy = Math.abs( Math.round(start.y) - Math.round(end.y) )
    return dx + dy;
}

async function computeDistance(tile){
    console.log("started promise");
    let path = astar(map, me, tile, heuristic);
    //if(path.length === 0 ) reject("no path");
    console.log(path);
    return path;
    //return new Promise(function (resolve, reject) { });
}

async function agentLoop () {
    let done = false;
    console.log("boh")
    while (true) {
        console.log(map.tiles);
        if(map.tiles.length > 0){
            console.log(map.tiles)
            let destinations = map.tiles.filter((t) => t.destination === true);
            console.log(destinations)
            for(let d of destinations){
                await computeDistance(d).then((res) => {
                    console.log(res);
                    done = true;
                });
            }


        }
        await new Promise(() => setTimeout(()=>{console.log("waited")}, 1));
    }
}




agentLoop();
