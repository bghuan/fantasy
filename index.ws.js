let ws_url = "wss://bghuan.cn/ws2"

let globalWebSocket

const connect = (websocketUrl, room = "") => {
    wscontent.innerHTML = ''
    var webSocket = new WebSocket(websocketUrl, room)
    globalWebSocket = webSocket

    webSocket.onclose = err => console.log(err)
    webSocket.onerror = err => console.log(err)
    webSocket.onopen = function (event) { }
    webSocket.onmessage = event => {
        wscontent.innerHTML += '<p>' + (event.data) + '</p>'
    }
}

let on_ws_send = () => {
    globalWebSocket.send(ws_text.value)
    ws_text.value = ''
}
ws_send.onclick = on_ws_send

document.getElementById("ws_text").addEventListener("keyup", event => { if (event.keyCode == 13) { on_ws_send() } })