
const WebSocket = require('ws');
var server = new WebSocket.Server({ port: 8091 });

server.on('connection', client => {
    client.on('message', (data, isBinary) => broadcast(data, client, isBinary))
    client.on("binary", data => broadcast(data, client))
    client.on('close', () => server.clients.delete(client))
    client.on('error', () => server.clients.delete(client))
});

const broadcast = (data, ws, isBinary) =>
    server.clients.forEach(client =>
        client.protocol == ws.protocol ? client.send(data, { binary: isBinary }) : undefined)