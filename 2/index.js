let a_Collapse, b_Collapse, isGoBack, stop_service, asd, cache = {}, filter_jump
const api = 'https://dev.buguoheng.com'
const readPath = '/api/read'
const createPath = '/api/create'

document.addEventListener("DOMContentLoaded", (function () {
    if (stopServiceIfDateNine()) return
    window.addEventListener('hashchange', query_onhashchange, false)
    inj_svg()
    load_bootstrap_js()
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
    let key = decodeURI(location.href).split('a=')[1] || ''
    if (isGoBack) {
        b_Collapse.hide()
        a_Collapse.hide()
        if (cache[key]) {
            queryCallBack(cache[key])
            return
        }
    }
    HttpGet(location.hash.slice(1), queryCallBack)
}

const query = (str, purpose) => {
    isGoBack = false;
    a_Collapse.hide()
    let key = str || ''
    let url = (key == '' ? '' : readPath + '?a=' + key)
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
            if (str?.indexOf('jump') >= 0)
                window.location.href = 'http://' + str.split(' ')[1]
            window.location.hash = url
    }
}
const create = () => {
    let key = fantasy_key.value
    let value = fantasy_value.value
    if ((key + value).trim().length == 0 || (a == 'fantasy' && b.length == 0)) return
    if (key == '') key = 'fantasy'
    if (!value && key != 'fantasy') {
        value = fantasy_key.value;
        key = 'fantasy'
    }
    let url = createPath + '?a=' + key + '&b=' + JSON.stringify(typeof value == "string" ? b.split(",") : [])
    url = createPath + '?a=' + key + '&b=' + value
    let callBack = create_id => {
        if (create_id.length == 24) {
            localStorage.id += (',' + create_id)
        }
        query('', 'force')
    }
    HttpGet2(url, callBack)
}
const queryCallBack = (json) => {
    fantasy_title.innerHTML = 'fantasy'
    fantasy_key.value = ''
    fantasy_value.value = ''
    fantasy_content.innerHTML = ''
    let fantasy, content
    var innerText = ''
    for (j in json) {
        innerText += '<div>'
        content = (json[j]['b'] == null || json[j]['b'] == '' ? '' : json[j]['b'] + ' - ')
        if (content)
            innerText += '<a>' + content + '</a>'
        fantasy = json[j]['a'] || ''
        if (fantasy)
            innerText += '<a>' + fantasy + '</a>'
        innerText += '</div>'
    }
    fantasy_content.innerHTML = innerText
    if (!isGoBack && !filter_jump && json && json.length)
        cache[fantasy_key.value || ''] = json
}
filter = function (str) {
    let data = cache[fantasy_key.value || ''].filter(function (item) {
        return JSON.stringify(item).indexOf(str) > -1
    })
    filter_jump = true
    queryCallBack(data)
    query(str)
    setTimeout(() => {
        filter_jump = false
    }, 1000);
}

fantasy_content.onkeyup = event => { if (event.keyCode == 13) { query(fantasy_search.value) } }
fantasy_key.onkeyup = event => { if (event.keyCode == 13) { create() } }
fantasy_value.onkeyup = event => { if (event.keyCode == 13) { create() } }
fantasy_value.onkeydown = event => { if (event.keyCode == 13) { event.preventDefault() } }
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
add_listen('enter', () => { b_Collapse.show(); fantasy_search.focus() })
add_listen('console', () => { loadJS('https://unpkg.com/vconsole@latest/dist/vconsole.min.js', () => { new window.VConsole() }) })

footer.addEventListener('show.bs.modal', function () {
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

document.addEventListener('click', (event) => {
    let arr = ['fantasy_key', 'fantasy_value', 'collapseb', 'fantasy_search', 'collapsea']
    if (arr.indexOf(event.target.id) == -1) {
        b_Collapse.hide()
        a_Collapse.hide()
    }
}, false)

collapseb.addEventListener('shown.bs.collapse', () => fantasy_key.focus())
collapsea.addEventListener('shown.bs.collapse', () => fantasy_search.focus())

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
    setTimeout(stopServiceIfDateNine, 10)
    return true
}
const show_more = () => {
    more_content.style.display = more_content.style.display == 'inline-block' ? 'none' : 'inline-block'
    more_content.scrollIntoView()
}
const inj_svg = () => {
    buttons.innerHTML = '<span onclick="query(\'\',\'personal\')" class="btn-light btn-sm"><svg xmlns="http://www.w3.org/2000/svg"width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span><span onclick="query()" class="btn-light btn-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24"height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span><span onclick="query(a,\'refresh\')" class="btn-light btn-sm"><svg xmlns="http://www.w3.org/2000/svg"width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></span><button class="btn btn-sm border" data-toggle="collapse" data-target="#collapseb" aria-expanded="false"aria-controls="collapseb"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"class="feather feather-feather"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg></button>'
    svg_github.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"> <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"> </path> </svg>'
}

const load_bootstrap_js = () => {
    loadJS('static/js/bootstrap.min.js', () => {
        a_Collapse = new bootstrap.Collapse(collapsea, { toggle: false })
        b_Collapse = new bootstrap.Collapse(collapseb, { toggle: false })
    })
}
filter.onclick = () => filter(fantasy_search.value || 'fantasy')
filter.onclick = () => query(fantasy_search.value || 'fantasy', 'force')
create.onclick = () => create()
more.onclick = () => show_more()
fantasy_content.onclick = (event) => {
    if (event.target.parentNode.lastChild.nodeName == "A")
        query(event.target.parentNode.lastChild.innerText.replace('-', ''))
}
content.style.minHeight = window.innerHeight - footer.offsetHeight - header.offsetHeight + 'px'
beian.style.textDecoration = 'none'