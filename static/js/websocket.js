const WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 8091 });

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        broadcast(data, ws)
    });
    ws.on('close', function () {
        wss.clients.delete(ws)
    });
    ws.on('error', function () {
        wss.clients.delete(ws)
    });
});

function broadcast(data, ws) {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

setInterval(() => broadcast('', null), 60000)
