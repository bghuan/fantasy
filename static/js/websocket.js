var WebSocketServer = require('ws').Server
wss = new WebSocketServer({ port: 8091 });

wss.on('connection', function (client) {
    clientList.push(client);
    client.on('message', function (message) {
        broadcast(message, client);
    });
});

let clientList = [];

function broadcast(message, client) {
    for (var i = 0; i < clientList.length; i++) {
        if (client !== clientList[i]) {
            clientList[i].send(message);
        }
    }
}

setInterval(() => broadcast('', null), 60000)
