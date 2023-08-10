import {DeliverooApi} from "@unitn-asa/deliveroo-js-client";
import config from "../config.js";

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