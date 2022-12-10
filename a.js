let host = 'https://dev.bghuan.cn'
let url = 'https://dev.bghuan.cn/api/read'
let url2 = 'https://dev.bghuan.cn/api/read?a='
let log = console.log
let limit = 130
let image_h = 110
let image_w = 110
let _1x1_image = host + '/static/image/1x1.bmp'

let render_data = (data) => {
    let allllll = ''
    for (let i = 0; i < data.length && i < limit; i++) {
        const a = data[i]['a'];
        const b = data[i]['b'];
        if (data.length > json_all.length) {
            json_all.push(data[i])
            json_all2.push({ [a]: b })
        }
        if (a == 'a_b') continue
        // if (a == 'fantasy') continue
        // if (a == 'test') continue
        let cccc = (a + '-' + b).substring(0, 80)
        let src = _1x1_image
        let data_src = `https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/${cccc}.jpg?x-oss-process=image/resize,m_lfit,h_${image_h},w_${image_w}`
        let right_image = `<img src="${src}" class="rounded-start" width=${image_h} height=${image_h} style="margin-top:6px;margin-left:-7px;" data-url="${data_src}">`
        let aaaaa = `
<div class="card mb-2 border-light">
        <div class="d-flex" style="height:122px;">
            ${right_image}        
            <div class="card-body" style="overflow-y: hidden">
                <h5 style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">${a}</h5>
                <p>${b}</p>
            </div>
        </div>
</div>`
        allllll += aaaaa
    }
    uuu.innerHTML = allllll

    lazy_image()
}
fetch(url).then(response => response.json()).then(json => render_data(json))

lazy_image = () => {
    var imgs = document.getElementsByTagName('img')
    let io = new IntersectionObserver((entires) => {
        entires.forEach(item => {
            let oImg = item.target
            if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
                if (oImg.getAttribute('err-image') != 1 && decodeURI(oImg.src) != oImg.getAttribute('data-url'))
                    oImg.setAttribute('src', oImg.getAttribute('data-url'))
            }
            oImg.onerror = function () {
                oImg.setAttribute('src', _1x1_image)
                oImg.setAttribute('err-image', 1)
            };
        })
    })
    Array.from(imgs).forEach(element => {
        io.observe(element)
    });
}
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
    if (event.target.nodeName == 'H5')
        a = event.target.parentNode.querySelector('h5').innerText
    else if (event.target.nodeName == 'P')
        a = event.target.parentNode.querySelector('h5').innerText
    else if (event.target.nodeName == 'DIV') {
        a = event.target.querySelector('h5').innerText
        div = event.target
    }
    else if (event.target.nodeName == 'IMG') {
        a = event.target.parentNode.querySelector('h5').innerText
        let b = event.target.parentNode.querySelector('p').innerText
        let cccc = (a + '-' + b).substring(0, 80)
        if (event.target.src == _1x1_image) {
            oImg = event.target
            oImg.setAttribute('src', host + '/static/image/download.png')
            fetch(host + '/api/openai.php?a=' + cccc.replace('.jpg', '').substring(0, 80)).then(response => {
                oImg.setAttribute('err-image', 2)
                oImg.setAttribute('src', oImg.getAttribute('data-url'))
                oImg.onerror = function () {
                    oImg.setAttribute('src', _1x1_image)
                    oImg.setAttribute('err-image', 1)
                };
            })
            return
        }
    }
    if (a == '') {
        return
    }
    query(fantasy_search.value = (a))
    // div.className += ' text-bg-primary'
    // if (div.childNodes.length != 2) {
    //     for (let i = div.childNodes.length; i > 2; i--) {
    //         div.removeChild(div.childNodes[i - 1])
    //     }
    //     div.lastChild.className = div.lastChild.className.replace(' d-none', '')
    //     setTimeout(() => {
    //         div.className = div.className.replace(' text-bg-primary', '')
    //     }, 10);
    //     return
    // }
    // callBack = (data) => {
    //     let allllll = ''
    //     for (let i = 0; i < data.length; i++) {
    //         const a = data[i]['a'];
    //         let aaaaa = '<p class="card-text">' + a + '</p>'
    //         allllll += aaaaa
    //     }
    //     div.lastChild.className += ' d-none'
    //     div.innerHTML += allllll
    //     div.className = div.className.replace(' text-bg-primary', '')
    // }
    // fetch(url2 + a).then(response => response.json()).then(json => callBack(json))
}
