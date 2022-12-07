let url = 'https://buguoheng.com/api/read'
let url2 = 'https://buguoheng.com/api/read?a='
let log = console.log
let limit = 10
let callBack = (data) => {
    let allllll = ''
    for (let i = 0; i < data.length && i < limit; i++) {
        const a = data[i]['a'];
        const b = data[i]['b'];
        let aaaaa = '<li class="card mb-3"><div class="card-body"><h4 class="card-title">' + a + '</h4><p class="card-text">' + b + '</p></div></li>'
        allllll += aaaaa
        // if(i==10){
        //     uuu.innerHTML = allllll
        // }
    }
    uuu.innerHTML = allllll
}
fetch(url).then(response => response.json()).then(json => callBack(json))

let uuu_down = 0
let uuu_up = 0
let uuu_select = 0
uuu.onmousedown = (event) => {
    uuu_down = Date.now()
    if (document.getSelection().toString().length > 0) {
        uuu_select = 1
    }
}
uuu.onmouseup = (event) => {
    if (Date.now() - uuu_up < 200) {
        return
    }
    if (Date.now() - uuu_down > 100) {
        return
    }
    if (uuu_select == 1) {
        uuu_select = 0
        return
    }
    uuu_up = Date.now()
    if (event.button != 0) return
    let a = ''
    let div = event.target.parentNode
    if (event.target.nodeName == 'H4')
        a = ((event.target.innerText))
    else if (event.target.nodeName == 'P')
        a = ((event.target.parentNode.firstChild.innerText))
    else if (event.target.nodeName == 'DIV') {
        a = ((event.target.firstChild.innerText))
        div = event.target
    }
    if (a == '') {
        return
    }
    div.className += ' text-bg-primary'
    if (div.childNodes.length != 2) {
        for (let i = div.childNodes.length; i > 2; i--) {
            div.removeChild(div.childNodes[i - 1])
        }
        div.lastChild.className = div.lastChild.className.replace(' d-none', '')
        setTimeout(() => {
            div.className = div.className.replace(' text-bg-primary', '')
        }, 10);
        return
    }
    callBack = (data) => {
        let allllll = ''
        for (let i = 0; i < data.length; i++) {
            const a = data[i]['a'];
            let aaaaa = '<p class="card-text">' + a + '</p>'
            allllll += aaaaa
        }
        div.lastChild.className += ' d-none'
        div.innerHTML += allllll
        div.className = div.className.replace(' text-bg-primary', '')
    }
    fetch(url2 + a).then(response => response.json()).then(json => callBack(json))
}
const more = () => {
    // more_content.className = more_content.className == 'd-none' ? '' : 'd-none'
    more_content.style.display = more_content.style.display == 'inline-block' ? 'none' : 'inline-block'
}

btn_more.onclick = more