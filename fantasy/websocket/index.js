let globalWebSocket, currentFile, client
let asd, cl = console.log, useOss = false
let regPicture = /\.(png|jpg|gif|jpeg|webp|ico|svg)$/, regSvg = /\.(svg)$/

// webSocket, use global/locate can reload webSocket
const connect = (websocketUrl = "wss://buguoheng.com/ws") => {
    var webSocket = new WebSocket(websocketUrl)
    globalWebSocket = webSocket

    webSocket.onopen = function (event) {
        document.getElementById("send").className = "btn btn-outline-primary"
        document.getElementById("lableFile").className = "form-file-button btn btn-outline-primary"
        document.getElementById('text').disabled = false
        document.getElementById('text').focus()
    }
    webSocket.onclose = event => {
        document.getElementById("send").className = "btn btn-danger disabled"
        document.getElementById("lableFile").className = "form-file-button btn btn-danger disabled"
        document.getElementById('text').disabled = true
    }
    webSocket.onmessage = event => {
        if (typeof event.data == "string")
            onmessageString(event.data)
        else if (typeof event.data == "object")
            onmessageBinary(event.data)
    }
    webSocket.onerror = err => console.log(err)
}

// webSocket write to ui
const send = data => globalWebSocket.send(data)
const onmessageString = data => {
    if (currentFile) {
        currentFile.name = data
        setFileOrImage(currentFile)
        currentFile = null
    } else if (data) {
        writeString(data)
    }
}
const onmessageBinary = data => currentFile = data
const writeString = data => {
    let node = document.createElement('p')
    node.innerHTML = data
    write(node)
}
const sendString = (data, flag) => {
    if (!flag) data = HTMLEncode(data)
    if (myCatch(data)) return
    send(data)
    writeString(data)
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
const paste = data => (data.length && data[0].type.indexOf('image') >= 0) ? sendFile(data[0].getAsFile()) : null
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
    setFileOrImage(data)
    return false
}
const write = node => {
    node.style.fontSize = "36px"
    node.className += "text-light"
    document.getElementById("msg").appendChild(node)
    document.getElementById('text').value = ''
    document.getElementById('text').focus()
    var timer = setInterval(() => {
        if (node.complete == undefined || node.complete) clearInterval(timer)
        document.getElementById("footer").scrollIntoView()
    }, 10)
}
const createFileLink = (fileName, file) => {
    let downLink = document.createElement('a')
    downLink.className = 'd-block '
    downLink.download = fileName
    if (file) downLink.href = URL.createObjectURL(new Blob([file]))
    else downLink.href = fileName
    downLink.innerHTML = fileName.replace("http://bgh-open.oss-cn-hangzhou.aliyuncs.com/", "")
    return downLink
}

// oss, use aliyun oss to send/receive big file
const setClient = (json) => {
    client = new OSS({
        region: 'oss-cn-hangzhou',
        accessKeyId: json['Credentials']['AccessKeyId'],
        accessKeySecret: json['Credentials']['AccessKeySecret'],
        stsToken: json['Credentials']['SecurityToken'],
        bucket: 'bgh-open'
        // secure: true
    });
}
let putFile = data => {
    if (data.type == "change") data = data.target.files[0]
    else if (data.type == "drop") {
        if (data.dataTransfer.files[0])
            data = data.dataTransfer.files[0]
        else return false
    }
    if (!data) return false
    if (data.size < (1024 * 1024 * 3)) return sendFile(data)
    if (typeof OSS != "undefined") ossPut(data)
    else loadJS(() => HttpGet(res => ossPut(data, setClient(JSON.parse(res)))))
    return false
}
const ossPut = data => {
    client.put(data.name, data).then(function (r1) {
        let link = createFileLink(r1.url)
        let div = document.createElement("div")
        link.className += "text-light"
        div.append(link)
        sendString(div.innerHTML, true)
    }).catch(function (err) {
        console.error(err);
    });
}
let listOssObject = () => client.list().then(res => res.objects.map(obj => write(createFileLink(obj.url))))
let initOssClient = (func, data) => loadJS(() => HttpGet(res => func(data, setClient(JSON.parse(res)))))

// common
const HttpGet = (callBack, str = 'https://buguoheng.com/php/sts.php') => {
    let xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP")
    xmlhttp.onreadystatechange = () => { if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { callBack(xmlhttp.responseText) } }
    xmlhttp.open("GET", str, true)
    xmlhttp.send()
}
const loadJS = function (callback, url = 'https://buguoheng.com/static/js/aliyun-oss-sdk-6.8.0.min.js') {
    let script = document.createElement('script')
    script.src = url
    script.type = "text/javascript"
    script.onload = callback
    document.body.appendChild(script)
}
function HTMLEncode(html) {
    var temp = document.createElement("div")
    temp.textContent != null ? (temp.textContent = html) : (temp.innerText = html)
    return temp.innerHTML
}

// listenning
// send message
document.getElementById("send").addEventListener("click", () => sendString(document.getElementById('text').value))
document.addEventListener("keyup", event => event.keyCode == 13 ? sendString(document.getElementById('text').value) : null)

// send image/file
document.getElementById('file').addEventListener('change', putFile)
document.getElementById("text").addEventListener("paste", (event) => paste(event.clipboardData.items))

// 拖入文件发送,进入子集的时候 会触发ondragover 频繁触发 不给ondrop机会
document.ondragover = () => false
document.ondrop = putFile

connect()

let myCatch = cmd => {
    switch (cmd) {
        case 'list': {
            if (typeof OSS != "undefined") listOssObject()
            else initOssClient(listOssObject)
            return true
        }
        case 'clear': {
            writeString("")
            document.getElementById("msg").innerHTML = ""
            return true
        }
        case 'black': {
            writeString("")
            document.body.style.backgroundImage = null
            document.body.style.backgroundColor = "#000"
            document.body.style.color = "#fff"
            return true
        }
        case 'none': {
            writeString("")
            document.querySelector("#only").className = "fixed-bottom d-none"
            return true
        }
        case 'right': {
            writeString("")
            document.querySelector("#msg").className = "float-right"
            return true
        }
        case 'terminal': {
            return false
        }
    }
}