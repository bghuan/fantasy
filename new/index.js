let path_api = 'https://dev.buguoheng.com/new/php'
let path_read = path_api + '/read.php'
let path_create = path_api + '/create.php'
let path_updatetime = path_api + '/updatetime.php'
let cl = console.log

let HttpPost = (url, data, callBack) => {
    fetch(url, { method: 'POST', body: Form(data) })
        .then(response => response.text())
        .then(json => callBack(json))
}

let Form = (data) => {
    let formdata = new FormData()
    if (typeof data == 'object') {
        for (let key in data) {
            formdata.set(key, data[key])
        }
    }
    else if (typeof data == 'string') {
        formdata.set(data, '')
    }
    return formdata
}

let fun_read = (data, flag) => {
    if (!flag) {
        return window.location.hash = data || ''
    }
    let callBack = function (json) {
        json = typeof json == 'object' ? json : typeof json == 'string' ? JSON.parse(json) : []
        let innerHTML = ""
        content.innerHTML = innerHTML
        for (let item in json) {
            let checked = localStorage.id?.indexOf(json[item]._id['$oid']) > -1 ? "checked=\"checked\"" : ""
            let value = " value=\"" + json[item]['_id']['$oid'] + "\" "
            let text = ""
            for (let i in json[item]) {
                if (i != '_id' && i != 'date') {
                    text += i + ':' + json[item][i] + ''
                }
            }
            if (text)
                innerHTML += '<p><input type="checkbox"' + checked + value + ' />' + text + '</p>'
        }
        setTimeout(() => {
            content.innerHTML = innerHTML
        }, 20);
    }
    HttpPost(path_read, data, callBack)
}

let fun_check = (id, checked) => {
    if (checked) {
        localStorage.id = (localStorage.id ? (localStorage.id + ',') : '') + id
        let callBack = () => fun_read()
        let data = { 'id': id }
        HttpPost(path_updatetime, data, callBack)
    }
    else {
        localStorage.id = localStorage.id?.replaceAll(id, '').replaceAll(',,', ',')
    }
}

let create_dur = (e) => {
    if (e && e.target && e.target.id.indexOf('create') >= 0) {
        query_key.style.display = 'none'
        create_key.style.display = 'inline'
        create_value.style.display = 'inline'
    }
    else {
        window.removeEventListener('click', create_dur)
        query_key.style.display = 'inline'
        create_key.style.display = 'none'
        create_value.style.display = 'none'
    }
}
let fun_create = () => {
    if (create_key.style.display == 'none') {
        return window.addEventListener('click', create_dur)
    }
    let fun_create_callBack = (id) => {
        localStorage.id = (localStorage.id ? (localStorage.id + ',') : '') + id
        fun_read(create_key.value)
    }
    let key = create_key.value
    let value = create_value.value
    let data = {}
    data[key] = value
    HttpPost(path_create, data, fun_create_callBack)
}

let fun_content_click = (e) => {
    if (e.target.tagName == 'INPUT') {
        fun_check(e.target.value, e.target.checked)
    }
    else if (e.target.tagName == 'P') {
        fun_read(e.target.innerText.split(':')[0])
    }
}

let fun_content_filter = (keywords) => {
    if (!keywords) return fun_read()
    let innerHTML = ''
    let word = keywords?.split(' ')
    for (let i = 0; i < content.childNodes.length; i++) {
        let count_flag = 0
        for (let j = 0; j < word?.length; j++) {
            if (content.childNodes[i].innerText.indexOf(word[j]) > -1) {
                count_flag++
            }
        }
        if (count_flag == word?.length) {
            innerHTML += '<p>' + content.childNodes[i].innerHTML + '</p>'
        }
    }
    content.innerHTML = innerHTML
}

let fn_hashchange = () => fun_read(my_querystring, true)
let my_convert = (str) => {
    if (!str || (str.indexOf && str.indexOf('=')) < 0) {
        return str
    }
    let result = {}
    let list = str.split('&')
    for (let i = 0; i < list.length; i++) {
        result[list[i].split('=')[0]] = list[i].split('=')[1]
    }
    return result
}

content.onclick = (e) => fun_content_click(e)
create_button.onclick = () => fun_create()
query_button.onclick = () => fun_read(query_key.value)
query_button_personal.onclick = () => fun_read('id=' + localStorage.id)
query_button_home.onclick = () => fun_read()
query_button_refresh.onclick = () => fun_read(my_querystring, true)
query_filter_button.onclick = () => { fun_content_filter(query_key.value) }
window.addEventListener('hashchange', fn_hashchange, false)
window.__defineGetter__('my_querystring', () => { return my_convert(location.hash.slice(1)) });

fun_read(my_querystring, true)
create_key.style.display = 'none'
create_value.style.display = 'none'
//id过长,querystring放不下,map,post真实传值的sha256hash放到querystring上?