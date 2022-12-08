// let url = 'https://buguoheng.com/api/read'
// let url2 = 'https://buguoheng.com/api/read?a='
let host = 'http://dev.bghuan.cn'
let url = 'http://dev.bghuan.cn/php/read'
let url2 = 'http://dev.bghuan.cn/php/read?a='
let log = console.log
let limit = 100
let srcccc = []
let callBack = (data) => {
    let allllll = ''
    for (let i = 0; i < data.length && i < limit; i++) {
        const a = data[i]['a'];
        const b = data[i]['b'];
        let cccc = (a + '-' + b).substring(0, 80)
        let src = host + '/static/image/openai/' + cccc + '.jpg'
        srcccc.push(src)
        // fetch('http://dev.bghuan.cn/php/openaiimage.php?a=' + cccc)
        let aaaaa = '<li class="card mb-3"><div class="col-md-4"><img src="' + src + '" class="img-fluid rounded - start" alt="..."></div><div class="card - body"><h4 class="card - title">' + a + '</h4><p class="card - text">' + b + '</p></div></li>'

        aaaaa = '<li class="card mb-3"><div class="row"><div class="col-md-2"><img src="' + src + '" class="img-fluid rounded-start" width="96"></div><div class="col-md-10"><div class="card-body"><h4 class="card-title">' + a + '</h4><p class="card-text">' + b + '</p></div></div></div></li>'

        aaaaa = `
<div class="col-md-6 col-sm-12">
    <div class="card mb-3">
        <div class="d-flex" style="height:140px">
            <img src="${src}" class="rounded-start " width="140" height="140">
            <div class="card-body" style="overflow-y: hidden;">
                <h4 class="card-title">${a}</h4>
                <p class="card-text">${b}</p>
            </div>
        </div>
    </div>
</div>`

        allllll += aaaaa
        if (i == 10) {
            uuu.innerHTML = allllll
        }
    }
    uuu.innerHTML = allllll

    let imagessss = document.querySelectorAll('img')

    let saaaaaaa = 0
    for (let i = 0; i < imagessss.length; i++) {
        if (saaaaaaa == 1) return
        var img = new Image();
        img.src = imagessss[i].src;
        let a = decodeURI(img.src).split('openai/')[1]
        img.onerror = function () {
            saaaaaaa = 1
            fetch('http://dev.bghuan.cn/php/openaiimage.php?a=' + a.replace('.jpg', '').substring(0, 80))
        };

    }
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