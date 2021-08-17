const WebSocket = require('ws');
var server = new WebSocket.Server({ port: 8091 });
const room = 'room'
const blankSpace = ' '
let allRoom = {}
let allRoomLengthLimit = 10000
let allRoomMaxLimit = 4

server.on('connection', client => {
    client.on('message', data => broadcast(data, client))
    client.on("binary", data => broadcast(data, client))
    client.on('close', () => server.clients.delete(client))
    client.on('error', () => server.clients.delete(client))
});

const broadcast = (data, ws) => {
    let flag = false
    if (ws && data && data.split && data.split(blankSpace)[0] == room) {
        ws[room] = data.split(blankSpace)[1]
        let length = data.split(blankSpace)[2]
        if (length) {
            let i = 0; for (let a in allRoom) { i++ }
            if (length.length && length.length < allRoomMaxLimit && parseInt(length) != NaN && i < allRoomLengthLimit) {
                allRoom[room] = length
            }
            else {
                flag = true
            }
        }
    }
    let clients = []
    server.clients.forEach(client => {
        if (client[room] == ws[room] || (!client[room] && !ws[room])) {
            clients.push(client)
        }
    })
    clients.forEach(client => {
        if ((ws[room] && allRoom[room] && allRoom[room] < clients.length) || flag) {
            client.close()
        }
        else if (ws != client) {
            client.send(data)
        }
    })
}

setInterval(() => broadcast('', {}), 50000)