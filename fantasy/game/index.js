
let save_path = 'https://bghuan.cn/api/save'
let namespace = 'bghuan.game'
let default_object = { title: '', describe: '' }
let json_all = []
let push_limit = 0

let render = (json) => {
    content.innerHTML = ''
    for (let index = 0; index < json.length; index++) {
        const item = json[index];
        let element = `
                <div class="card mt-2 border-0">
                    <input type="text" onkeyup=push() class="fs-4 form-control" value="${item.title}">
                    <textarea onkeyup=push2(this) class="card-text form-control" rows='1'>${item.describe}</textarea>
                </div>`
        content.innerHTML += element.replaceAll('    ', '').replaceAll('\n', '')
    }
    textarea_auto_height()
}
let textarea_auto_height = () => {
    let textareas = document.getElementsByTagName('textarea')
    for (let index = 0; index < textareas.length; index++) {
        const element = textareas[index];
        element.style.height = element.scrollHeight + 20 + 'px'
    }
}
let push2 = (element) => {
    if (element.offsetHeight < element.scrollHeight && element.style.height != element.scrollHeight + 2 + 'px') {
        element.style.height = element.scrollHeight + 20 + 'px'
    }
    push()
}
let pull = () => {
    let url = save_path + '?namespace=bghuan.game&data'
    fetch(url).then(response => response.json()).then(json => {
        json_all = JSON.parse(json['data']);
        render(json_all)
    })
}
let push = () => {
    let json = make_data()
    let json_str = JSON.stringify(json)
    if (json_str == JSON.stringify(json_all)) return
    div_add.className = 'd-none'
    div_pushing.className = ''
    let formData = new FormData()
    formData.append('namespace', namespace)
    formData.append('data', json_str)

    let _push_limit = push_limit++
    setTimeout(() => {
        if (push_limit == _push_limit + 1)
            fetch(save_path, { method: 'POST', body: formData }).then(response => {
                div_add.className = ''
                div_pushing.className = 'd-none'
                json_all = json
            })
    }, 200);
}
let make_data = () => {
    let json = []
    let inputs = document.getElementsByTagName('input')
    let textareas = document.getElementsByTagName('textarea')
    for (let index = 0; index < inputs.length; index++) {
        const title = inputs[index].value;
        const describe = textareas[index].value;
        if (!title && !describe) continue
        let _json = { title: title, describe: describe }
        json.push(_json)
    }
    return (json)
}
add.onclick = () => {
    json_all.push(default_object)
    render(json_all)
    document.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].focus()
}

pull()