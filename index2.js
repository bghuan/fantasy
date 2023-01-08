
let host = location.origin.toString().indexOf('localhost') >= 0 ? 'https://dev.bghuan.cn' : location.origin
let read_path = host + '/api/read'
let create_path = host + '/api/create'
let save_path = host + '/api/save'
let default_image_path = host + '/static/image/1x1.bmp'
let log = console.log
let limit = 20000
let image_h = 110
let image_w = 110
let image_wh2 = 60
let uuu_down = 0
let uuu_up = 0
let uuu_select = 0
let sudo_change_image = 0
let sudo_change_image_text = ''
let json_all = []
let stop_service = false
let a_Collapse
let b_Collapse
let redner_data_data = []
let save = { hide_json: [], error_image: [] }


let render_data = (data) => {
    let allllll = ''
    let a, b, cccc, data_src, src, right_image, aaaaa, i_real = 0
    json_all = json_all.length == 0 ? data : json_all
    redner_data_data = []
    // for (let i = data.length - 1; i >= 0 && i < limit; i--) {
    for (let i = 0; i < data.length && i < limit; i++) {
        a = data[i]['a']?.toString().replaceAll('\"', '\'').replaceAll('\n', '');
        b = data[i]['b']?.toString().replaceAll('\"', '\'').replaceAll('\n', '');

        // if (a == 'fantasy') continue
        if (a == 'test') continue
        if (a == 'yo') continue
        if (!a || !b) continue

        if (save.hide_json.includes(a + b) && window.location.hash.slice(1) == '') continue

        cccc = (a + '-' + b).substring(0, 80).replaceAll('?', '%3F')
        data_src = `https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/${cccc}.jpg?x-oss-process=image/resize,m_lfit,h_${image_h},w_${image_w}`
        if (save.error_image.includes(cccc)) data_src = default_image_path

        right_image = `<img src="${data_src}" class="rounded" width=${image_w} height=${image_w} onerror=image_onerr(event) ondragend=image_ondragend(event) ondragstart=image_ondragstart(event)>`
        redner_data_data.push([right_image, a, b])
        aaaaa = `<div></div>`
        allllll += aaaaa
        i_real++
        if (i_real == 19) {
            uuu.innerHTML = allllll
            allllll = ''
            layz_div()
        }
    }
    uuu.innerHTML += allllll
    layz_div()
}
let layz_div = () => {
    var divs = uuu.childNodes
    let observer = new IntersectionObserver((entires) => {
        entires.forEach(item => {
            let element = item.target

            var index = [].indexOf.call(uuu.childNodes, element);
            if (index == -1) return
            if (index >= redner_data_data.length) return

            let a = redner_data_data[index][1]
            let b = redner_data_data[index][2]
            let cccc = (a + '-' + b).substring(0, 80).replaceAll('?', '%3F')

            if (save.hide_json.includes(a + b) && window.location.hash.slice(1) == '') {
                // element.parentElement.removeChild(element)
                element.className = 'd-none'
                return
            }
            if (save.error_image.includes(cccc)) {
                data_src = default_image_path
                right_image = `<img src="${data_src}" class="rounded" width=${image_w} height=${image_w} onerror=image_onerr(event) ondragend=image_ondragend(event) ondragstart=image_ondragstart(event)>`
                redner_data_data[index][0] = right_image
            }

            if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
                let aaaaaaaa = `
<div class="d-flex">
    ${redner_data_data[index][0]}
    <div class="card-body">
        <h5>${redner_data_data[index][1]}</h5>
        <p>${redner_data_data[index][2]}</p>
    </div>
</div>`
                element.className = 'card'
                element.innerHTML = aaaaaaaa.replaceAll('    ', '').replaceAll('\n', '')
                observer.unobserve(element)
            }
        })
    }, {
        threshold: [0, 1]
    })
    Array.from(divs).forEach(element => {
        observer.observe(element)
    });
}
let save_push = (str) => {
    let flag = false
    Object.keys(save).forEach(item => {
        if (save.default && save.default[item] != JSON.stringify(save[item]))
            flag = true
    })
    if (!flag) return
    var formData = new FormData();
    formData.set('namespace', host)
    if (!str) {
        Object.keys(save).forEach(item => { formData.set(item, JSON.stringify(save[item])) })
    } else
        formData.set(str, JSON.stringify(save[str]))
    fetch(save_path, { method: 'POST', body: formData }).then(response => response.json()).then(json => save.default = json)
}
let image_onerr_push = () => {
    save.error_image_limit_time = save.error_image_limit_time + 1 || 1
    let error_image_limit_time = save.error_image_limit_time
    setTimeout(() => {
        if (save.error_image_limit_time == error_image_limit_time)
            save_push('error_image')
    }, 1000);
}
let image_onerr = (event) => {
    let oImg = event.target;
    let src = decodeURI(oImg.src).replace('https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/', '').replace('.jpg?x-oss-process=image/resize,m_lfit,h_110,w_110', '')
    if (!save.error_image.includes(src))
        save.error_image.push(src)
    oImg.setAttribute('src', default_image_path)
    oImg.setAttribute('err-image', 1)
    image_onerr_push()
}
let image_ondragstart = event => {
    let oImg = event.target;
    oImg.xxx = event.clientX
}
let image_ondragend = event => {
    let oImg = event.target
    let a = oImg.parentNode.querySelector('h5').innerText
    let b = oImg.parentNode.querySelector('p').innerText
    if (oImg.xxx < event.clientX) {
        if (!save.hide_json.includes(a + b))
            save.hide_json.push(a + b)
    } else {
        save.hide_json.splice(save.hide_json.indexOf(a + b), 1)
    }
    save_push('hide_json')
}
let image_change = (oImg) => {
    let a = oImg.parentNode.querySelector('h5').innerText
    let b = oImg.parentNode.querySelector('p').innerText
    let cccc = (a + '-' + b).substring(0, 80).replaceAll('?', '%3F')
    let data_src = `https://bghuan.oss-cn-shenzhen.aliyuncs.com/image/openai/${cccc}.jpg?x-oss-process=image/resize,m_lfit,h_${image_h},w_${image_w}`
    oImg.setAttribute('src', data_src)
    oImg.onerror = () => {
        oImg.setAttribute('src', host + '/static/image/download.png')
        let url = host + '/api/openai.php?a=' + cccc.replace('.jpg', '').substring(0, 80)
        if (sudo_change_image_text != '') url += '&b=' + sudo_change_image_text
        fetch(url).then(response => {
            oImg.setAttribute('src', data_src)
            oImg.onerror = () => image_onerr(oImg)
        })
        sudo_change_image_text = ''
    }
    save.error_image.splice(save.error_image.indexOf(cccc), 1)
    save_push('error_image')
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

    let h5_or_p = 'h5'
    if (window.location.hash.slice(1) != '') { h5_or_p = 'p' }

    let a = event.target.parentNode.querySelector(h5_or_p).innerText
    if (event.target.nodeName == 'DIV')
        a = event.target.querySelector(h5_or_p).innerText
    else if (event.target.nodeName == 'IMG') {
        if (event.target.src == default_image_path || sudo_change_image_text != '') {
            return image_change(event.target)
        }
        // let a = event.target.parentNode.querySelector('h5').innerText
        // let b = event.target.parentNode.querySelector('p').innerText
        // let cccc = (a + '-' + b).substring(0, 80).replaceAll('?', '%3F')
        // save.error_image.splice(save.error_image.indexOf(cccc), 1)
        // save_push()
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

const query = () => {
    window.location.hash = fantasy_search.value
    if (!window.location.hash)
        history.replaceState(null, '', location.pathname)
}
const create = () => {
    let key = fantasy_key.value
    let value = fantasy_value.value
    if (!key && !value) return
    if (!(key && value) && (key || value)) {
        value = key || value
        key = 'fantasy'
    }
    let url = create_path + '?' + key + '=' + value
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
    }
    render_data(json)
}
const stopServiceIfDateNine = () => {
    if (new Date().getDate() == '9') { document.body.innerHTML = new Date() + '<br />' + '每月9号不收集展示幻想'; stop_service = true; } else if (stop_service) window.location.reload(); else return false; setTimeout(stopServiceIfDateNine, 100); return true;
}
const loadJS = function (url, callback) {
    let script = document.createElement('script'); script.src = url; script.type = "text/javascript"; if (script.onreadystatechange) { script.onreadystatechange = function () { if (this.readyState == "complete" || this.readyState == "loaded") { script.onreadystatechange = null; callback(); } } } else { script.onload = () => callback(); } document.body.appendChild(script);
}
document.addEventListener("DOMContentLoaded", (function () {
    if (stopServiceIfDateNine()) return
    a_Collapse = new bootstrap.Collapse(collapsea, { toggle: false })
    b_Collapse = new bootstrap.Collapse(collapseb, { toggle: false })
    collapseb.addEventListener('shown.bs.collapse', () => fantasy_key.focus())
    collapsea.addEventListener('shown.bs.collapse', () => fantasy_search.focus())
    document.getElementById("fantasy_search").addEventListener("keyup", event => { if (event.keyCode == 13) { on_btn_query() } })
    document.getElementById('exampleModalLong').addEventListener('show.bs.modal', function () {
        if (document.getElementsByClassName("modal-body")[0].innerHTML.length <= 0) { let callBack = (json) => { let converter = new showdown.Converter(); document.getElementsByClassName("modal-body")[0].innerHTML = converter.makeHtml(json); }; loadJS('static/js/showdown.min.js', () => { fetch('README.md').then(response => response.text()).then(json => { callBack(json); }) }) }
    })
    document.addEventListener('click', (event) => {
        if (document.getSelection().toString().length > 0) return
        let arr = ['fantasy_key', 'fantasy_value', 'collapseb', 'fantasy_search', 'collapsea']
        if (arr.indexOf(event.target.id) == -1) {
            b_Collapse.hide()
            a_Collapse.hide()
        }
    }, false)

    btn_query.onclick = on_btn_query
    btn_create.onclick = create
    btn_filter.onclick = filter
    btn_more.onclick = more
    window.onhashchange = query_onhashchange

    fetch(read_path).then(response => response.json()).then(json => {
        render_data(json)
        if (window.location.hash.slice(1) != '') query_onhashchange()
    })

    setTimeout(() => {

        let url = `${host}/api/save?namespace=${host}`
        Object.keys(save).forEach(item => { url += `&${item}` })
        fetch(url).then(response => response.json()).then(json => {
            Object.keys(save).forEach(item => {
                save[item] = json[item] ? JSON.parse(json[item]) : []
            })
            save.default = json
        })
    }, 1000);
}))



// let url = `${host}/api/save?namespace=${host}`
// Object.keys(save).forEach(item => { url += `&${item}` })
// fetch(url).then(response => response.json()).then(json => {
//     Object.keys(save).forEach(item => {
//         save[item] = json[item] ? JSON.parse(json[item]) : []
//     })
//     save.default = json
// })
let url = `${host}/api/save?namespace=${host}&hide_json`
fetch(url).then(response => response.json()).then(json => {
    save[hide_json] = JSON.parse(json[hide_json])
})

url = `${host}/api/save?namespace=${host}&error_image`
fetch(url).then(response => response.json()).then(json => {
    save[error_image] = JSON.parse(json[error_image])
})