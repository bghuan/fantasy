let create_url = 'https://buguoheng.com/api/save'
let url_id = 'buguoheng'

let send_message = function () {
    let content_value = '?namespace=' + url_id + '&content=' + (content.value)
    fetch(create_url + content_value).then(response => response.text()).then(text => get.click())
}
send.onclick = send_message
get.onclick = function () {
    let content_value = '?namespace=' + url_id + '&key=content'
    let callBack = function (data) {
        content.value = data
    }
    fetch(create_url + content_value)
        .then(response => response.text())
        .then(json => {
            callBack(json)
        })
}
get.click()
aaa.onkeydown = function (event) {
    aaa.hohoho = true
}
aaa.onkeyup = function (event) {
    aaa.hohoho = true
    let content_value = '?namespace=' + url_id + '&content2=' + (aaa.value)
    let callBack = function (data) {
        aaa.hohoho = false
    }
    fetch(create_url + content_value).then(response => response.text()).then(text => { callBack() })
}

let tick = 1000
let tick_func = function () {
    if (aaa.hohoho) return
    if (tick < 2000) tick += 100
    let content_value2 = '?namespace=' + url_id + '&key=content2'
    let callBack2 = function (data) {
        if (aaa.hohoho) return
        if (aaa.value == data) return
        if (aaa.value.length > data.length) return
        tick = 100
        aaa.value = data
    }
    fetch(create_url + content_value2)
        .then(response => response.text())
        .then(json => {
            callBack2(json)
        })
}
tick_func()
setInterval(() => {
    tick_func()
}, tick);

add.onclick = function () {
    let input = document.createElement('input')
    input.style.display = 'block'
    inputs.appendChild(input)
}

inputs_send.onclick = function (event) {
    let ddd = []
    for (let i = 0; i < inputs.children.length; i++) {
        ddd.push(inputs.children[i].value)
    }
    let content_value = '?namespace=' + url_id + '&ddd=' + JSON.stringify(ddd)
    fetch(create_url + content_value).then(response => response.text()).then(text => { })
}
inputs_get.onclick = function (event) {
    let callBack = function (data) {
        let ddd = JSON.parse(data.ddd)
        inputs.innerHTML = ''
        for (let i = 0; i < ddd.length; i++) {
            let input = document.createElement('input')
            input.style.display = 'block'
            input.value = ddd[i]
            inputs.appendChild(input)
        }
    }
    let content_value = '?namespace=' + url_id + '&ddd'
    fetch(create_url + content_value).then(response => response.json()).then(json => { callBack(json) })
}
inputs_get.click()