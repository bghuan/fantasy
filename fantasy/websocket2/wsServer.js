// const WebSocket = require('ws');
// var server = new WebSocket.Server({ port: 8092 });
// var history = {}

// server.on('connection', client => {
//     history[client.protocol]?.forEach(data => client.send(data));

//     client.on('message', data => broadcast(data, client))
//     client.on("binary", data => broadcast(data, client))
//     client.on('close', () => server.clients.delete(client))
//     client.on('error', () => server.clients.delete(client))
// });

// const broadcast = (data, ws) => {
//     server.clients.forEach(client => client.protocol == ws.protocol ? client.send(data) : undefined)
//     if(data) history[ws.protocol] = (history[ws.protocol] ?? []).concat([data])
// }

// setInterval(()=>broadcast('',{}),5*1000)
const WebSocket = require('ws');
var server = new WebSocket.Server({ port: 8092 });
var history = []

server.on('connection', client => {
    history.forEach(data => client.send(data));

    client.on('message', data => broadcast(data, client))
    client.on("binary", data => broadcast(data, client))
    client.on('close', () => server.clients.delete(client))
    client.on('error', () => server.clients.delete(client))
});

const broadcast = (data, ws) => {
    server.clients.forEach(client => client.send(data))
    if(data) {
        history= history.concat([data])
        require("https").get('https://buguoheng.com/php/save.php?key=websocket2&value='+(new Date().getTime()));
    }
}

setInterval(()=>broadcast('',{}),50*1000)