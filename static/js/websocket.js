var WebSocketServer = require('ws').Server
wss = new WebSocketServer({ port: 8091 });

let lastedMessage
let clientList = []

wss.on('connection', function (client) {
    if (lastedMessage) client.send(lastedMessage)
    clientList.push(client);
    client.on('message', function (message) {
        lastedMessage = message
        broadcast(message, client);
    });
});

function broadcast(message, client) {
    for (var i = 0; i < clientList.length; i++) {
        if (client !== clientList[i]) {
            clientList[i].send(message);
        }
    }
}

setInterval(() => { broadcast('', null); lastedMessage = null }, 60000)
