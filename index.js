
let host = location.origin.toString().indexOf('localhost') >= 0 ? 'https://dev.bghuan.cn' : location.origin
let url = host + '/api/read'
let log = console.log
let limit = 20000
let image_h = 110
let image_w = 110
let image_wh2 = 60
let _1x1_image = host + '/static/image/1x1.bmp'
let uuu_down = 0
let uuu_up = 0
let uuu_select = 0
let sudo_change_image = 0
let sudo_change_image_text = ''
let createPath = host + '/api/create'
let json_all = []
let allllll = ''
let allllll_final = ''
let stop_service = false

const query = () => {
    window.location.hash = fantasy_search.value
    if (!window.location.hash) history.replaceState(null, '', location.pathname)
}
const create = () => {
    let key = fantasy_key.value
    let value = fantasy_value.value
    if (!key && !value) return
    if (!(key && value) && (key || value)) {
        value = key || value
        key = 'fantasy'
    }
    let url = createPath + '?' + key + '=' + value
    let callBack = (create_id) => {
        b_Collapse.hide()
        localStorage.id = localStorage.id + (',' + create_id)
        location.reload()
    }
    fetch(url).then(response => response.text()).then(json => callBack(json))
}
const filter = () => {
    let key = fantasy_search.value
    let json = json_all.filter(item => item.a.indexOf(key) >= 0 || item.b.toString().indexOf(key) >= 0)
    render_data(json)
    a_Collapse.hide()
}
const more = () => {
    more_content.style.display = more_content.style.display == 'inline-block' ? 'none' : 'inline-block'
}
const query_onhashchange = () => {
    a_Collapse.hide()
    let key = decodeURI(window.location.hash.slice(1))
    fantasy_title.innerText = key || 'fantasy'
    fantasy_search.value = key
    fantasy_key.value = key
    let json = json_all.filter(item => item.a == key)
    if (!key) {
        json = json_all
        // return uuu.innerHTML = allllll_final
    }
    render_data(json)
    show_button_editor()
    // connect(ws_url, decodeURI(window.location.hash.slice(1)) || 'gnrioabneruiafru')
}
const show_button_editor = () => {
    // if (window.location.hash.slice(1) != '') {
    //     editor.className = editor.className.replace('d-none', 'd-inline')
    // }
    // else {
    //     editor.className = editor.className.replace('d-inline', 'd-none')
    // }
}
const show_editor = () => {
    let key = decodeURI(window.location.hash.slice(1))//.replaceAll('%','%25')
    let src = `${host}/fantasy/editor/?fantasy.${key}`
    let height = '500'
    uuu.innerHTML += `<iframe src="${src}" style="height:${height}px"></iframe>`
}
editor.onclick = show_editor

// btn_query.onclick = query
btn_create.onclick = create
btn_filter.onclick = filter
btn_more.onclick = more
window.onhashchange = query_onhashchange


let render_data = (data) => {
    allllll = ''
    uuu.innerHTML = ''
    let a, b, cccc, data_src, src, right_image, aaaaa
    json_all = json_all.length == 0 ? data : json_all
    for (let i = 0; i < data.length && i < limit; i++) {
        // if (a == 'a_b') continue
        // if (a == 'fantasy') continue
        // if (a == 'test') continue
        a = data[i]['a'].toString().replaceAll('\"', '\'');
        b = data[i]['b'].toString().replaceAll('\"', '\'');
        cccc = (a + '-' + b).substring(0, 80).replaceAll('?', '%3F')
        data_src = `https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/${cccc}.jpg?x-oss-process=image/resize,m_lfit,h_${image_h},w_${image_w}`
        src = _1x1_image
        right_image = `<img src="${src}" class="rounded" width=${image_wh2} height=${image_wh2} data-url="${data_src}">`
        let height = 72
        let is_show_h5 = ''
        // if (window.location.hash.slice(1) != '') {
        //     height = 72
        //     is_show_h5 = ' class="d-none"'
        //     sss.className = 'col-9'
        //     uuu.className = 'col-3'
        //     right_image = `<img src="${src}" class="rounded" width=${image_wh2} height=${image_wh2} data-url="${data_src}">`
        // }
        // else
        {
            height = 122
            sss.className = ''
            uuu.className = ''
            right_image = `<img src="${src}" class="rounded" width=${image_w} height=${image_w} data-url="${data_src}">`
        }
        aaaaa = `
<div class="card mb-2 border-light">
    <div class="d-flex">
        ${right_image}        
        <div class="card-body" style="height:${height}px">
            <h5${is_show_h5}>${a}</h5>
            <p>${b}</p>
        </div>
    </div>
</div>`
        allllll += aaaaa
        if ((data.length < 21 && data.length == i + 1) || i == 19) {
            uuu.innerHTML = allllll
            allllll = ''
            lazy_image()
            if (allllll_final == '')
                allllll_final = uuu.innerHTML
        }
    }
}
let lazy_image = () => {
    var imgs = document.getElementsByTagName('img')
    let io = new IntersectionObserver((entires) => {
        entires.forEach(item => {
            let oImg = item.target
            if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
                if (oImg.getAttribute('err-image') == 1) return
                if (decodeURI(oImg.src) == oImg.getAttribute('data-url')) return
                oImg.setAttribute('src', oImg.getAttribute('data-url'))
            }
            oImg.onerror = () => image_onerr(oImg)
        })
    })
    Array.from(imgs).forEach(element => {
        io.observe(element)
    });
}
let io2 = new IntersectionObserver((entires) => {
    entires.forEach(item => {
        if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
            if (allllll != '') {
                uuu.innerHTML += allllll
                allllll_final = uuu.innerHTML
                allllll = ''
                lazy_image()
            }
        }
    })
})
io2.observe(footer)

let image_onerr = (oImg) => {
    oImg.setAttribute('src', _1x1_image)
    oImg.setAttribute('err-image', 1)
}
let image_change = (oImg) => {
    let a = oImg.parentNode.querySelector('h5').innerText
    let b = oImg.parentNode.querySelector('p').innerText
    let cccc = (a + '-' + b).substring(0, 80)
    oImg.setAttribute('src', host + '/static/image/download.png')
    let url = host + '/api/openai.php?a=' + cccc.replace('.jpg', '').substring(0, 80)
    if (sudo_change_image_text != '') url += '&b=' + sudo_change_image_text
    fetch(url).then(response => {
        oImg.setAttribute('src', oImg.getAttribute('data-url'))
        oImg.onerror = () => image_onerr(oImg)
    })
    sudo_change_image_text = ''
}

uuu.onmousedown = (event) => {
    uuu_down = Date.now()
    if (document.getSelection().toString().length > 0) uuu_select = 1
}
uuu.onmouseup = (event) => {
    if (event.button != 0) return
    if (uuu_select == 1) return uuu_select = 0
    if (Date.now() - uuu_up < 200) return
    if (Date.now() - uuu_down > 100) return
    uuu_up = Date.now()

    let a = event.target.parentNode.querySelector('h5').innerText
    if (event.target.nodeName == 'DIV')
        a = event.target.querySelector('h5').innerText
    else if (event.target.nodeName == 'IMG') {
        if (event.target.src == _1x1_image || sudo_change_image_text != '') {
            return image_change(event.target)
        }
    }
    query(fantasy_search.value = (a))
}

let on_btn_query = () => {
    let aaaaaaaa = fantasy_search.value?.split('image:')
    if (aaaaaaaa.length > 1) {
        var imgs = document.getElementsByTagName('img')
        let oImg = imgs[aaaaaaaa[0]]
        sudo_change_image_text = aaaaaaaa[1]
        image_change(oImg)
    } else {
        query()
    }
}
btn_query.onclick = on_btn_query




let a_Collapse
let b_Collapse

const stopServiceIfDateNine = () => {
    if (new Date().getDate() == '9') {
        document.body.innerHTML = new Date() + '<br />' + '每月9号不收集展示幻想'
        stop_service = true
    } else if (stop_service)
        window.location.reload()
    else return false
    setTimeout(stopServiceIfDateNine, 100)
    return true
}
//dialog
document.getElementById("fantasy_search").addEventListener("keyup", event => { if (event.keyCode == 13) { on_btn_query() } })
const loadJS = function (url, callback) {
    let script = document.createElement('script')
    script.src = url
    script.type = "text/javascript"
    if (script.onreadystatechange) {
        script.onreadystatechange = function () {
            if (this.readyState == "complete" || this.readyState == "loaded") {
                script.onreadystatechange = null
                callback()
            }
        }
    } else {
        script.onload = () => callback()
    }
    document.body.appendChild(script)
}
document.getElementById('exampleModalLong').addEventListener('show.bs.modal', function () {
    if (document.getElementsByClassName("modal-body")[0].innerHTML.length <= 0) {
        let callBack = (json) => {
            let converter = new showdown.Converter()
            document.getElementsByClassName("modal-body")[0].innerHTML = converter.makeHtml(json)
        }
        loadJS('static/js/showdown.min.js', () => {
            fetch('README.md')
                .then(response => response.text())
                .then(json => {
                    callBack(json)
                })
        })
    }
})
document.addEventListener("DOMContentLoaded", (function () {
    if (stopServiceIfDateNine()) return
    a_Collapse = new bootstrap.Collapse(collapsea, { toggle: false })
    b_Collapse = new bootstrap.Collapse(collapseb, { toggle: false })
    collapseb.addEventListener('shown.bs.collapse', () => fantasy_key.focus())
    collapsea.addEventListener('shown.bs.collapse', () => fantasy_search.focus())
    document.addEventListener('click', (event) => {
        let arr = ['fantasy_key', 'fantasy_value', 'collapseb', 'fantasy_search', 'collapsea']
        if (arr.indexOf(event.target.id) == -1) {
            b_Collapse.hide()
            a_Collapse.hide()
        }
    }, false)

    fetch(url).then(response => response.json()).then(json => {
        render_data(json)
        query_onhashchange()
    })
    // connect(ws_url, decodeURI(window.location.hash.slice(1)) || 'gnrioabneruiafru')
}))