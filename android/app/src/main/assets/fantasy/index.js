let a, b, a_Collapse, b_Collapse, isGoBack, stop_service, asd, cache = {}, filter_jump
const api =  'https://buguoheng.com'
const readPath = '/php/read.php'
const createPath = '/php/create.php'

document.addEventListener("DOMContentLoaded", (function () {
    if (stopServiceIfDateNine()) return
    if (typeof zzz != 'undefined') queryCallBack(zzz)
    else HttpGet(location.hash.slice(1), (res) => {
        queryCallBack(res)
    })
    window.addEventListener('hashchange', query_onhashchange, false)
    a_Collapse = new bootstrap.Collapse(document.getElementById('collapsea'), { toggle: false })
    b_Collapse = new bootstrap.Collapse(document.getElementById('collapseb'), { toggle: false })
    loginCallback()
}))

function HttpGet(str, callBack, standard) {
    let url = standard ? str : api + (str || readPath)
    fetch(url)
        .then(response => response.json())
        .then(json => {
            callBack(json)
            isGoBack = true
        })
}

function HttpGet2(str, callBack, standard) {
    let url = standard ? str : api + (str || readPath)
    fetch(url)
        .then(response => response.text())
        .then(json => {
            callBack(json)
            isGoBack = true
        })
}
const HttpGetPure = (str, callBack) => {
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callBack(xmlhttp.responseText)
        }
    }
    xmlhttp.open("GET", str, true)
    xmlhttp.send()
}
const query_onhashchange = () => {
    if (filter_jump) return
    a = decodeURI(location.href).split('a=')[1] || ''
    if (isGoBack) {
        b_Collapse.hide()
        a_Collapse.hide()
        if (cache[a]) {
            queryCallBack(cache[a])
            return
        }
    }
    HttpGet(location.hash.slice(1), queryCallBack)
}

const query = (str, purpose) => {
    isGoBack = false;
    rmcollapsea()
    a = str || ''
    let url = (a == '' ? '' : readPath + '?a=' + a)
    switch (purpose) {
        case "personal":
            url = readPath + '?a=personal&id=' + localStorage.getItem('id') || ''
            window.location.hash = url
            break
        case "refresh":
            queryCallBack([])
            HttpGet(location.hash.slice(1), queryCallBack)
            break
        case "force":
            queryCallBack([])
            HttpGet(url, queryCallBack)
            window.location.hash = url
            break
        default:
            if(str?.indexOf('jump')>=0)
              window.location.href = 'https://'+str.split(' ')[1]
            window.location.hash = url
    }
}
const create = () => {
    rmcollapseb()
    a = document.getElementById("a").value
    b = document.getElementById("b").value
    if ((a + b).trim().length == 0 || (a == 'fantasy' && b.length == 0)) return
    if (a == '') a = 'fantasy'
    if(!b&&a != 'fantasy'){
        b=document.getElementById("a").value;
       a = 'fantasy'
    }
    let url = createPath + '?a=' + a + '&b=' + JSON.stringify(typeof b == "string" ? b.split(",") : [])
    url = createPath + '?a=' + a + '&b=' + b
    let callBack = create_id => {
        if (create_id.length == 24) {
            localStorage.id += (',' + create_id)
        }
        query('', 'force')
    }
    HttpGet2(url, callBack)
}
//card1.style.height=window.innerHeight-card.style.marginTop.replace('px','')-document.getElementById('as').style.height+'px'
const queryCallBack = (json) => {
    document.getElementById("a_top").innerHTML = a || 'fantasy'
    document.getElementById("a").value = a || ''
    document.getElementById("input_query").value = ''
    hide_id_edit()
    let div_query = document.getElementById("div_query")
    div_query.innerHTML = ''
    let div, fantasy, content

    rtrim=function(data){
    return data<10?'0'+data:data
}
var getDate = function (date = new Date()) {
    return date.getFullYear() + '-' + rtrim(date.getMonth() + 1) + '-' + rtrim(date.getDate()) + ' ' + rtrim(date.getHours()) + ":" + rtrim(date.getMinutes()) + ":" + rtrim(date.getSeconds())
}

var iii=0
    for (j in json) {
        div = document.createElement("div")
        fantasy = document.createElement("a")
        content = document.createElement("a")
        // if(json[j]['_id']){
        // let id = document.createElement("a")
        // iii++
        // id.innerHTML =(iii)+' '+getDate(new Date(parseInt(json[j]['_id']['$oid'].substr(0,8),16)*1000))
        // div.appendChild(id)}
        fantasy.innerHTML = json[j]['a'] || ''
        content.innerHTML = (json[j]['b'] == null || json[j]['b'] == '' ? '' : json[j]['b'] + ' - ')
        if (content.innerHTML)
            div.appendChild(content)
        div.appendChild(fantasy)
        div_query.appendChild(div)
    }
    for (let item = 0; item < div_query.children.length; item++) {
        div_query.children[item].onclick = function () {
            query(div_query.children[item].children.length > 1 ? div_query.children[item].children[1].innerHTML : div_query.children[item].children[0].innerHTML)
        }
    }
    if (!isGoBack && !filter_jump && json && json.length)
        cache[a || ''] = json
}
// fetch
filter = function (str) {
    let data = cache[a || ''].filter(function (item) {
        return JSON.stringify(item).indexOf(str) > -1
    })
    filter_jump = true
    queryCallBack(data)
    query(str)
    setTimeout(() => {
        filter_jump = false
    }, 1000);
}
var json1 = [
    { a: 'a', b: '<image src="https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/d6a3950e0566aa2a8b71e6e37e1271e.png" />', _id: { $id: 123 } }
]

const show_id_edit = () => {
    if (document.getElementById('addid').style.display == 'block') { hide_id_edit() } else {
        document.getElementById('addid').style.display = 'block'
        document.getElementById("addid").scrollIntoView()
        // document.getElementById('af').value = localStorage.id
        // setTimeout(function () { order_id() }, 2000)
    }
}

const hide_id_edit = () => { document.getElementById('addid').style.display = 'none' }
const update_id = () => {
    localStorage.setItem(new Date().toLocaleString(), localStorage.id)
    localStorage.id = document.getElementById('af').value
    query('', 'personal')
}
const query_id = () => {
    document.body.innerHTML = "<button class='btn btn-primary' onclick='location.replace(location.href)'>刷新</a>"
    for (i in localStorage) { if (i > '2019' && i < '2030' || i == "id") { document.body.innerHTML += "<h6>" + i + "</h6><p>" + localStorage[i] + "</p>" } }
    document.body.innerHTML += "<br />"
}
const order_id = () => {
    let ids = localStorage.getItem("id").split(',')
    let new_ids = ""
    for (let i = 0; i < ids.length; i++) { if (ids[i].toString().length == 24) { new_ids += ids[i] + ',' } }
    document.getElementById('af').value = new_ids.substr(0, new_ids.length - 1)
}
document.getElementById("input_query").addEventListener("keyup", event => { if (event.keyCode == 13) { query(document.getElementById("input_query").value) } })
document.getElementsByClassName("create")[0].addEventListener("keyup", event => { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keyup", event => { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keydown", event => { if (event.keyCode == 13) { event.preventDefault() } })
document.getElementById("div_card").style.minHeight = window.innerHeight - 90 + 'px'

let add_listen = (cmd, callBack) => {
    let index = 0
    let cmd_split = cmd.split('')
    document.addEventListener('keyup', (event) => {
        if (event.key != cmd_split[index])
            index = 0
        if (index++ == cmd_split.length - 1)
            callBack(index = 0)
    }, true)
}
add_listen('enter', () => { b_Collapse.show(); document.getElementById('a').focus() })
add_listen('console', () => { loadJS('https://unpkg.com/vconsole@latest/dist/vconsole.min.js', () => { new window.VConsole() }) })


// show README.md
document.getElementById('exampleModalLong').addEventListener('show.bs.modal', function () {
    if (document.getElementsByClassName("modal-body")[0].innerHTML.length <= 0) {
        let callBack = (json) => {
            let converter = new showdown.Converter()
            document.getElementsByClassName("modal-body")[0].innerHTML = converter.makeHtml(json)
        }
        loadJS('static/js/showdown.min.js', () => {
            HttpGet2('README.md', callBack, true)
        })
    }
})

const rmcollapseb = () => { b_Collapse.hide() }
const rmcollapsea = () => { a_Collapse.hide() }
let b_collapseb_show = document.getElementById('collapseb')
b_collapseb_show.addEventListener('show.bs.collapse', function () {
    document.getElementById('collapseb').addEventListener('click', e => { e.stopPropagation() })
    document.addEventListener('click', rmcollapseb, false)
})
let b_collapse_hidden = document.getElementById('collapseb')
b_collapse_hidden.addEventListener('hidden.bs.collapse', function () {
    document.getElementById('collapseb').removeEventListener('click', e => { e.stopPropagation() })
    document.removeEventListener('click', rmcollapseb, false)
})
let b_collapse_shown = document.getElementById('collapseb')
b_collapse_shown.addEventListener('shown.bs.collapse', function () {
    document.getElementById('a').focus()
})
let a_collapseb_show = document.getElementById('collapsea')
a_collapseb_show.addEventListener('show.bs.collapse', function () {
    document.getElementById('collapsea').addEventListener('click', e => { e.stopPropagation() })
    document.addEventListener('click', rmcollapsea, false)
})
let a_collapse_hidden = document.getElementById('collapsea')
a_collapse_hidden.addEventListener('hidden.bs.collapse', function () {
    document.getElementById('collapsea').removeEventListener('click', e => { e.stopPropagation() })
    document.removeEventListener('click', rmcollapsea, false)
})
let a_collapse_shown = document.getElementById('collapsea')
a_collapse_shown.addEventListener('shown.bs.collapse', function () {
    document.getElementById('input_query').focus()
})

// div_skip add button, need auto
// document.getElementById('div_skip').innerHTML = '<button class="btn btn-light btn-sm" onclick = "skip(0)" > 1</button> <button class="btn btn-light btn-sm" onclick="skip(1)">2</button> <button class="btn btn-light btn-sm" onclick="skip(2)">3</button> <button class="btn btn-light btn-sm" onclick="skip(3)">4</button> <button class="btn btn-light btn-sm" onclick="skip(4)">5</button> <button class="btn btn-light btn-sm" onclick="skip(5)">6</button> <button class="btn btn-light btn-sm" onclick="skip(6)">7</button> <button class="btn btn-light btn-sm" onclick="skip(7)">8</button> <input class="btn btn-sm border" border-radius="5px" type="text" id="skip" size="2"> <button class="btn btn-light btn-sm" onclick="skip(document.getElementById("skip").value)">skip</button>' + document.getElementById('div_skip').innerHTML

const login = () => {
    window.location.href = api + '/oauth/render/github'
}
const loginCallback = () => {
    if (getQueryVariable('code')) {
        let callBack = json => { if (json != null && json.data != null && json.data.username != null) alert("hello " + json.data.username) }
        let url = api + "/oauth/callback/github?"
        HttpGet(url + window.location.search.substring(1), callBack, true)
    }
}

const getQueryVariable = (variable) => {
    let queryString = window.location.search.substring(1)
    let lets = queryString.split("&")
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=")
        if (pair[0] == variable) { return pair[1] }
    }
    queryString = window.location.hash.substring(1)
    lets = queryString.split("?")
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=")
        if (pair[0] == variable) { return pair[1] }
    }
    queryString = window.location.hash.substring(1)
    lets = queryString.split("&")
    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split("=")
        if (pair[0] == variable) { return pair[1] }
    }
    return (false)
}
const loadJS = function (url, callback) {
    let script = document.createElement('script')
    script.src = url
    script.type = "text/javascript"
    if (script.onreadystatechange) {
        script.onreadystatechange = function () {
            if (this.readyState == "complete" || this.readyState == "loaded") {
                script.onreadystatechange = null
                callback()
            }
        }
    } else {
        script.onload = () => callback()
    }
    document.body.appendChild(script)
}

const stopServiceIfDateNine = () => {
    if (new Date().getDate() == '9') {
        document.body.innerHTML = new Date() + '<br />' + '每月9号不收集展示幻想'
        stop_service = true
    } else if (stop_service)
        window.location.reload()
    else return false
    setTimeout(stopServiceIfDateNine, 100)
    return true
}