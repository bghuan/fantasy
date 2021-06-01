const WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 8091 });
const warnMessage = 'room.clients.length > 2, connection is closed, please refresh page and change a room'

wss.on('connection', ws => {
    ws.on('message', data => broadcast(data, ws))
    ws.on("binary", data => broadcast(data, ws))
    ws.on('close', () => wss.clients.delete(ws))
    ws.on('error', () => wss.clients.delete(ws))
});

const broadcast = (data, ws) => {
    let clients = []
    if (data?.indexOf('room') === 0 && ws) ws.room = data.slice(4).trim()
    wss.clients.forEach(client => {
        if (!ws || (client != ws && ((!client.room && !ws.room) || client.room == ws.room)))
            clients.push(client)
    })
    if (ws?.room && clients.length > 1) clients.push(ws)
    clients.forEach(client => (ws?.room && clients.length > 1) ? client.close(client.send(warnMessage)) : client.send(data))
}

setInterval(() => broadcast('', null), 50000)
