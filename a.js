let host = location.origin
if (location.host.toString().indexOf('127') >= 0 || location.host.toString().indexOf('localhost') >= 0) host = 'https://dev.bghuan.cn'
let url = host + '/api/read'
let url2 = host + '/api/read?a='
let log = console.log
let limit = 300000
let image_h = 110
let image_w = 110
let _1x1_image = host + '/static/image/1x1.bmp'

let render_data = (data) => {
    let allllll = ''
    for (let i = 0; i < data.length && i < limit; i++) {
        let a = data[i]['a'].toString().replaceAll('\"', '\'');
        let b = data[i]['b'].toString().replaceAll('\"', '\'');
        if (data.length > json_all.length) json_all.push(data[i])
        // if (a == 'a_b') continue
        // if (a == 'fantasy') continue
        if (a == 'test') continue
        let cccc = (a + '-' + b).substring(0, 80)
        let data_src = `https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/${cccc}.jpg?x-oss-process=image/resize,m_lfit,h_${image_h},w_${image_w}`
        let src = i < 10 ? data_src : _1x1_image
        let right_image = `<img src="${src}" class="rounded-start" width=${image_h} height=${image_h} data-url="${data_src}">`
        let aaaaa = `
<div class="card mb-2 border-light">
        <div class="d-flex">
            ${right_image}        
            <div class="card-body">
                <h5>${a}</h5>
                <p>${b}</p>
            </div>
        </div>
</div>`
        allllll += aaaaa
        // if ((data.length < 21 && data.length == i - 1) || i == 19)
        //     uuu.innerHTML = allllll
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
                if (oImg.getAttribute('err-image') == 1) return
                if (decodeURI(oImg.src) == oImg.getAttribute('data-url')) return
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
let sudo_change_image = 0
let sudo_change_image_text = ''

uuu.onmousedown = (event) => {
    uuu_down = Date.now()
    if (document.getSelection().toString().length > 0) uuu_select = 1
}
uuu.onmouseup = (event) => {
    if (Date.now() - uuu_up < 200) return
    if (Date.now() - uuu_down > 100) return
    if (uuu_select == 1) {
        uuu_select = 0
        return
    }
    uuu_up = Date.now()
    if (event.button != 0) return
    let a = event.target.parentNode.querySelector('h5').innerText
    let b = event.target.parentNode.querySelector('p').innerText
    if (event.target.nodeName == 'DIV') a = event.target.querySelector('h5').innerText
    else if (event.target.nodeName == 'IMG') {
        let cccc = (a + '-' + b).substring(0, 80)
        if (event.target.src == _1x1_image || sudo_change_image == 1) {
            let oImg = event.target
            oImg.setAttribute('src', host + '/static/image/download.png')
            let url = host + '/api/openai.php?a=' + cccc.replace('.jpg', '').substring(0, 80)
            if (sudo_change_image_text) url += '&b=' + sudo_change_image_text
            fetch(url).then(response => {
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
    query(fantasy_search.value = (a))
}

let old_func = btn_query.onclick
btn_query.onclick = () => {
    let aaaaaaaa = fantasy_search.value?.split('image:')
    if (aaaaaaaa.length > 1) {
        var imgs = document.getElementsByTagName('img')
        let oImg = imgs[aaaaaaaa[0]]
        oImg.setAttribute('src', host + '/static/image/download.png')
        let a = oImg.parentNode.querySelector('h5').innerText
        let b = oImg.parentNode.querySelector('p').innerText
        let cccc = (a + '-' + b).substring(0, 80)
        let url = host + '/api/openai.php?a=' + cccc.replace('.jpg', '').substring(0, 80)
        url += '&b=' + aaaaaaaa[1]
        fetch(url).then(response => {
            oImg.setAttribute('err-image', 2)
            oImg.setAttribute('src', oImg.getAttribute('data-url'))
            oImg.onerror = function () {
                oImg.setAttribute('src', _1x1_image)
                oImg.setAttribute('err-image', 1)
            };
        })
    } else {
        old_func()
    }
}