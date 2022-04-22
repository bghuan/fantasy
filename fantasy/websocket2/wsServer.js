const WebSocket = require('ws');
var server = new WebSocket.Server({ port: 8092 });
var history = {}

server.on('connection', client => {
    history[client.protocol]?.forEach(data => client.send(data));

    client.on('message', data => broadcast(data, client))
    client.on("binary", data => broadcast(data, client))
    client.on('close', () => server.clients.delete(client))
    client.on('error', () => server.clients.delete(client))
});

const broadcast = (data, ws) => {
    server.clients.forEach(client => client.protocol == ws.protocol ? client.send(data) : undefined)
    history[ws.protocol] = (history[ws.protocol] ?? []).concat([data])
}