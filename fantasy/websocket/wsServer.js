const WebSocket = require('ws');
var server = new WebSocket.Server({ port: 8091 });

server.on('connection', client => {
    client.room = client.protocol
    client.on('message', data => broadcast(data, client))
    client.on("binary", data => broadcast(data, client))
    client.on('close', () => server.clients.delete(client))
    client.on('error', () => server.clients.delete(client))
});

const broadcast = (data, ws) => {
    server.clients.forEach(client => {
        if ((client.room == ws.room || (!client.room && !ws.room)) && ws != client) {
            client.send(data)
        }
    })
}

setInterval(() => broadcast('', {}), 50000)