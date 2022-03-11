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
        for (var key in data) {
            formdata.set(key, data[key])
        }
    }
    else if (typeof data == 'string') {
        formdata.set(data, '')
    }
    return formdata
}

let fun_read = (data) => {
    let callBack = function (json) {
        json = typeof json == 'object' ? json : typeof json == 'string' ? JSON.parse(json) : []
        let innerHTML = ""
        for (var item in json) {
            let checked = localStorage.id?.indexOf(json[item]._id['$oid']) > -1 ? "checked=\"checked\"" : ""
            let value = " value=\"" + json[item]['_id']['$oid'] + "\" "
            var text = ""
            for (var i in json[item]) {
                if (i != '_id' && i != 'date') {
                    text += i + ':' + json[item][i] + ''
                }
            }
            innerHTML += '<p><input type="checkbox"' + checked + value + ' />' + text + '</p>'
        }
        content.innerHTML = ""
        content.innerHTML = innerHTML
        location.hash = Math.random()
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
let fun_create = () => {
    let fun_create_callBack = (id) => {
        localStorage.id = (localStorage.id ? (localStorage.id + ',') : '') + id
        fun_read()
    }
    let key = create_key.value
    let value = create_value.value
    var data = { key, value }
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

query_button.onclick = () => fun_read(query_key.value)
create_button.onclick = () => fun_create()
query_button_personal.onclick = () => fun_read({ 'id': localStorage.id })
query_button_home.onclick = () => fun_read()
query_button_refresh.onclick = () => fun_read()
content.onclick = fun_content_click
query_filter_button.onclick = () => { fun_content_filter(query_key.value) }

fun_read()
