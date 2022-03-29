let globalWebSocket
let currentFile
let client
let regPicture = /\.(png|jpg|gif|jpeg|webp|ico|svg)$/
let regSvg = /\.(svg)$/
let websocket_url = "wss://dev.buguoheng.com/ws"

// webSocket, use global/locate can reload webSocket
const connect = (websocketUrl, room = "") => {
    if (room) {
        var webSocket = new WebSocket(websocketUrl, room)
    } else {
        var webSocket = new WebSocket(websocketUrl)
    }
    if (globalWebSocket) globalWebSocket.close()
    globalWebSocket = webSocket

    webSocket.onopen = function (event) {
        websocket_text.disabled = false
        websocket_text.focus()
        setInterval(() => globalWebSocket?.send(''), 50000);
        sendString('success connect at ' + (my_room || websocket_url), true)
    }
    webSocket.onclose = event => {
        websocket_text.disabled = true
    }
    webSocket.onmessage = event => onmessage2(event.data)
    webSocket.onerror = err => console.log(err)
}

// webSocket write to ui
const send = data => globalWebSocket.send(data)
const onmessage2 = data => {
    if (typeof data == "string") {
        if (currentFile) {
            currentFile.name = data
            setFileOrImage(currentFile)
            currentFile = null
        } else if (data) {
            writeString(data)
        }
    } else if (typeof data == "object") {
        currentFile = data
    }
}
const writeString = data => {
    let node = document.createElement('p')
    node.innerHTML = data
    write(node)
}
const sendString = (data, flag) => {
    if (flag) return writeString(data)
    send(data)
}
const setFileOrImage = data => regPicture.test(data.name) ? setImage(data) : setFile(data)
const setImage = data => {
    let reader = new FileReader()
    if (regSvg.test(data.name)) {
        reader.readAsText(new Blob([data]))
        reader.onload = (e) => write(e.target.result)
    } else {
        reader.readAsDataURL(new Blob([data]))
        reader.onload = function (e) {
            var img = new Image()
            img.src = e.target.result
            write(img)
        }
    }
}
const setFile = data => {
    write(createFileLink(data.name, data))
}
const paste = data => {
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].kind == 'file') {
                sendFile(data[i].getAsFile())
            }
            else if (data[i].kind == 'string') {
                data[i].getAsString((str) => {
                    sendString(str)
                })
            }
        }
    }
    return;
    (data.length && data[0].type.indexOf('image') >= 0) ? sendFile(data[0].getAsFile()) : null
}
const sendFile = data => {
    if (data.type == "change") data = data.target.files[0]
    else if (data.type == "drop") {
        if (data.dataTransfer.files[0])
            data = data.dataTransfer.files[0]
        else return false
    }
    if (!data) return false
    send(data)
    send(data.name)
    // setFileOrImage(data)
    return false
}
const write = node => {
    websocket_content.appendChild(node)
    websocket_text.value = ''
    websocket_text.focus()
    var timer = setInterval(() => {
        if (node.complete == undefined || node.complete) clearInterval(timer)
        websocket_footer.scrollIntoView()
    }, 10)
}
const createFileLink = (fileName, file) => {
    let downLink = document.createElement('a')
    downLink.download = fileName
    if (file) downLink.href = URL.createObjectURL(new Blob([file]))
    downLink.innerHTML = fileName
    return downLink
}

let putFile = data => {
    if (data.type == "change") data = data.target.files[0]
    else if (data.type == "drop") {
        if (data.dataTransfer.files[0])
            data = data.dataTransfer.files[0]
        else return false
    }
    if (!data) return false
    sendFile(data)
    return false
}

// listenning
// send message
websocket_button.onclick = () => sendString(websocket_text.value)
websocket_text.onkeyup = (e) => { if (e.key == 'Enter') sendString(websocket_text.value) }
websocket_text.addEventListener("paste", (event) => paste(event.clipboardData.items))

// 拖入文件发送,进入子集的时候 会触发ondragover 频繁触发 不给ondrop机会
// chrome 存在无法使用情况
websocket_div.ondragover = () => false
websocket_div.ondrop = putFile

let my_convert2 = (str) => {
    return str.indexOf('id=') === 0 ? Math.random() : str.replaceAll('=', '-')
}
let fn_hashchange2 = () => {
    connect(websocket_url, my_room)
}
window.addEventListener('hashchange', fn_hashchange2, false)
window.__defineGetter__('my_room', () => { return my_convert2(location.hash.slice(1)) });

connect(websocket_url, my_room)
// connect('ws://127.0.0.1:8091', room)
// 发送文件夹 连接中断