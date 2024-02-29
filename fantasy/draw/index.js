
var canvas = document.getElementById('content')
var content = canvas.getContext("2d")

document.addEventListener("mousedown", handleMousedown, false)
document.addEventListener("mousemove", handleMousemove, false)

function handleMousedown(event) {
    webSocket.send('beginPath')
}
function handleMousemove(event) {
    if (event.buttons == 0) return
    current = { x: event.clientX, y: event.clientY }
    webSocket.send(JSON.stringify(current))
}
var webSocket = new WebSocket("wss://bghuan.cn/ws", "draw")
webSocket.onmessage = event => {
    if (event.data == 'beginPath') {
        return content.beginPath()
    }
    current = JSON.parse(event.data)
    content.lineTo(current.x, current.y)
    content.stroke()
}