let path_api = 'https://dev.buguoheng.com/new/php'
let path_read = path_api + '/read.php'
let path_create = path_api + '/create.php'
let path_updatetime = path_api + '/updatetime.php'

let HttpPost = (url, data, callBack) => {
    fetch(url, { method: 'POST', body: data })
        .then(response => response.text())
        .then(json => callBack(json))
}

let fun_read = (formdata) => {
    let callBack = function (json) {
        json = JSON.parse(json)
        let innerHTML = ""
        for (var item in json) {
            let checked = localStorage.id?.indexOf(json[item]._id['$oid']) > -1 ? "checked=\"checked\"" : ""
            let value = " value=\"" + json[item]._id['$oid'] + "\""
            let onclick = " onclick=fun_create_callBack2(this.value,this.checked)"
            var text = ""
            for (var i in json[item]) {
                if (i != '_id' && i != 'date') {
                    text += i + ':' + json[item][i] + '<br>'
                }
            }

            innerHTML += '<p><input type="checkbox"' + checked + value + onclick + ' />' + text + '</p>'
        }
        content.innerHTML = innerHTML
    }
    let data = new FormData()
    data.set(query_key.value, '')
    if (formdata instanceof FormData) {
        data = formdata
    }
    HttpPost(path_read, data, callBack)
}

let fun_create_callBack2 = (id, checked) => {
    if (checked) {
        localStorage.id = (localStorage.id ? (localStorage.id + ',') : '') + id
        var data = new FormData()
        data.set('id', id)
        callBack = () => { }
        HttpPost(path_updatetime, data, callBack)
    }
}
let fun_create_callBack = (id) => {
    localStorage.id = (localStorage.id ? (localStorage.id + ',') : '') + id
}
let fun_create = () => {
    var data = new FormData()
    data.set(create_key.value, create_value.value)
    HttpPost(path_create, data, fun_create_callBack)
}

let fun_read_personal = () => {
    let callBack = function (json) {
        json = JSON.parse(json)
        content.innerText = ""
        for (var item in json) {
            content.innerText += json[item].key + ':' + json[item].value + '\n'
        }
    }
    var data = new FormData()
    data.set('id', localStorage.id)
    HttpPost(path_read, data, callBack)
}

query_button.onclick = fun_read
create_button.onclick = fun_create
query_button_personal.onclick = () => {
    var data = new FormData()
    data.set('id', localStorage.id)
    fun_read(data)
}
query_button_home.onclick = () => fun_read(new FormData())
query_button_refresh.onclick = fun_read

fun_read()