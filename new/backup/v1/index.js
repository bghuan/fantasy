let path_api = 'https://dev.buguoheng.com/new/php'
let path_read = path_api + '/read.php'
let path_create = path_api + '/create.php'

let HttpPost = (url, data, callBack) => {
    fetch(url, { method: 'POST', body: data })
        .then(response => response.text())
        .then(json => callBack(json))
}

let fun_read = () => {
    let callBack = function (json) {
        json = JSON.parse(json)
        content.innerText = ""
        for (var item in json) {
            content.innerText += json[item].key + ':' + json[item].value + '\n'
        }
    }
    HttpPost(path_read, new FormData(query_form), callBack)
}

let fun_create = () => {
    let callBack = function (text) {
    }
    HttpPost(path_create, new FormData(create_form), callBack)
}

query_button.onclick = fun_read
create_button.onclick = fun_create

fun_read()