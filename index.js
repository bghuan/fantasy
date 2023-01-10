
let host = location.origin.indexOf('localhost') >= 0 ? 'https://dev.bghuan.cn' : location.origin
let read_path = host + '/api/read'
let create_path = host + '/api/create'
let save_path = host + '/api/save'
let default_image_path = host + '/static/image/1x1.bmp'
let oss_image_prix = 'https://bghu.oss-cn-hangzhou.aliyuncs.com/'
let log = console.log
let limit = 20000
let image_h = 110
let image_w = 110
let image_wh2 = 60
let uuu_down = 0
let uuu_up = 0
let uuu_select = 0
let sudo_change_image_text = ''
// let json_all = []
let stop_service = false
let a_Collapse
let b_Collapse
let json_show = []
let json_show_hash = []
// let save = { hide: [], error: [], default: {} }
let div_observer
let default_search_title = fantasy_title.innerText


let render_data = (data) => {
    let allllll = ''
    let key, value, hash, image_src, innerHTML, i_real = 0
    json_show = []
    json_show_hash = []
    for (let i = 0; i < data.length && i < limit; i++) {
        key = data[i]['a']?.toString().replaceAll('\n', '');
        value = data[i]['b']?.toString().replaceAll('\n', '');
        hash = getHashCode(key + value)

        // if (key == 'fantasy') continue
        if (key == 'test') continue
        if (key == 'yo') continue
        if (!key || !value) continue
        if (save.hide.includes(hash) && window.location.hash.slice(1) == '') continue
        if (json_show_hash.includes(hash)) continue

        image_src = get_image_full_path(hash)

        json_show.push([image_src, key, value])
        json_show_hash.push(hash)
        innerHTML = `<div></div>`
        allllll += innerHTML
        i_real++
    }
    content.innerHTML = allllll
    layz_div()
}
let layz_div = () => {
    var divs = content.childNodes
    let div_observer = new IntersectionObserver((entires) => {
        entires.forEach(item => {
            if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
                show_div(item.target)
                div_observer?.unobserve(item.target)
            }
        })
    }, {
        threshold: [0, 1]
    })
    Array.from(divs).forEach(element => {
        div_observer.observe(element)
    });
}
let show_div = (element, flag = true) => {
    var index = [].indexOf.call(content.childNodes, element);
    if (index == -1) return
    if (index >= json_show.length) return

    let key = json_show[index][1]
    let value = json_show[index][2]
    let hash = getHashCode(key + value)

    if (save.hide.includes(hash) && window.location.hash.slice(1) == '')
        element.className = 'd-none'
    if (save.error.includes(hash) || !flag) {
        json_show[index][0] = default_image_path
    }

    let innerHTML = `
<div class="d-flex">
    ${get_image_element(json_show[index][0])}
    <div class="card-body">
        <h5>${json_show[index][1]}</h5>
        <p>${json_show[index][2]}</p>
    </div>
</div>`
    element.className = 'card'
    element.innerHTML = innerHTML.replaceAll('    ', '').replaceAll('\n', '')
}
let get_image_element = (src) => {
    return `<img src="${src}" class="rounded" width=${image_w} height=${image_w} onerror=image_onerr(event) ondragend=image_ondragend(event) ondragstart=image_ondragstart(event)>`
}
let get_clean_encodeurl = (str) => {
    str = str?.replaceAll('%%', '%25%')
    if (str?.includes('%%')) return get_clean_encodeurl(str)
    if (str?.substr(str.length - 1) == '%') return str?.substring(0, str.length - 1) + '%25'
    return str
}
let get_image_full_path = (hash) => {
    return oss_image_prix + hash + '.png' + '?x-oss-process=image/resize,m_lfit,h_110,w_110'
}
let save_pull = (str, callBack) => {
    let url = `${host}/api/save?namespace=${save.namespace}&${str}`
    fetch(url).then(response => response.json()).then(json => {
        if (!json || !json[str]) return
        save[str] = JSON.parse(json[str])
        save.default[str] = json
        if (callBack) callBack()
    })
}
let save_push = (str) => {
    for (let index = save.error.length; index > 0; index--) {
        if (typeof save.error[index] != 'number')
            save.error.splice(index, 1)
    }
    for (let index = save.hide.length; index > 0; index--) {
        if (typeof save.hide[index] != 'number')
            save.hide.splice(index, 1)
    }
    let flag = false
    Object.keys(save).forEach(item => {
        if (save.default && save.default[item] != JSON.stringify(save[item])) flag = true
    })
    if (!flag) return
    var formData = new FormData();
    formData.set('namespace', save.namespace)
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
            save_push('error')
    }, 1000);
}
let image_onerr = (event) => {
    let oImg = event.target;
    if (save.error.length != 0) {
        let src = oImg.src.replace(oss_image_prix, '').replace('.png?x-oss-process=image/resize,m_lfit,h_110,w_110', '')
        if (!save.error.includes(src))
            save.error.push(Number(src))
        image_onerr_push()
    }
    oImg.setAttribute('src', default_image_path)
}
let image_ondragstart = event => {
    let oImg = event.target;
    oImg.xxx = event.clientX
}
let image_ondragend = event => {
    let oImg = event.target
    let key = oImg.parentNode.querySelector('h5').innerHTML
    let value = oImg.parentNode.querySelector('p').innerHTML
    let hash = getHashCode(key + value)
    if (oImg.xxx < event.clientX) {
        if (!save.hide.includes(hash))
            save.hide.push(hash)
        oImg.parentNode.parentNode.className = 'd-none'
    } else {
        save.hide.splice(save.hide.indexOf(hash), 1)
    }
    save_push('hide')
}
let image_change = (oImg) => {
    let key = oImg.parentNode.querySelector('h5').innerHTML
    let value = oImg.parentNode.querySelector('p').innerHTML
    let hash = getHashCode(key + value)
    let image_src = get_image_full_path(hash)
    oImg.setAttribute('src', image_src)
    let callBack = () => {
        oImg.setAttribute('src', host + '/static/image/download.png')
        let url = host + '/api/openai.php?hash=' + hash
        if (sudo_change_image_text != '') url += '&prompt=' + sudo_change_image_text
        else url += '&prompt=' + key + '-' + value
        fetch(url).then(response => {
            oImg.setAttribute('src', image_src)
            oImg.onerror = image_onerr
        })
        sudo_change_image_text = ''
    }
    if (sudo_change_image_text != '') callBack()
    else oImg.onerror = callBack
    save.error.splice(save.error.indexOf(hash), 1)
    save_push('error')
}

content.onmouseleave = (event) => {
    let key = decodeURI(get_clean_encodeurl(window.location.hash.slice(1)))
    fantasy_title.innerText = key || default_search_title
}
content.onmouseover = (event) => {
    if (event.target == content) return
    let h5_or_p = 'h5'
    if (window.location.hash.slice(1) != '') { h5_or_p = 'p' }

    let key = event.target.parentNode.querySelector(h5_or_p)?.innerHTML
    if (event.target.nodeName == 'DIV')
        key = event.target.querySelector(h5_or_p)?.innerHTML
    if (key)
        fantasy_title.innerText = key
}
content.onmousedown = (event) => {
    uuu_down = Date.now()
    if (document.getSelection().toString().length > 0) uuu_select = 1
}
content.onmouseup = (event) => {
    if (event.button != 0) return
    if (uuu_select == 1) return uuu_select = 0
    if (Date.now() - uuu_up < 200) return
    if (Date.now() - uuu_down > 100) return
    if (collapsea.className.indexOf('show') > 0 || collapseb.className.indexOf('show') > 0) return
    if (event.target == content) return
    uuu_up = Date.now()

    let h5_or_p = 'h5'
    if (window.location.hash.slice(1) != '') { h5_or_p = 'p' }

    let key = event.target.parentNode.querySelector(h5_or_p)?.innerHTML
    if (event.target.nodeName == 'DIV')
        key = event.target.querySelector(h5_or_p).innerHTML
    else if (event.target.nodeName == 'IMG') {
        if (event.target.src == default_image_path || sudo_change_image_text != '') {
            return image_change(event.target)
        }
        // let key = event.target.parentNode.querySelector('h5').innerHTML
        // let value = event.target.parentNode.querySelector('p').innerHTML
        // let hash = getHashCode(key + value) + '.png'
        // // save.error.splice(save.error.indexOf(hash), 1)
        // // save_push()
        // return
    }
    if (key)
        query(fantasy_search.value = (key))
}

let on_btn_query = () => {
    let aaaaaaaa = fantasy_search.value?.split('image:')
    if (aaaaaaaa.length > 1) {
        var imgs = document.getElementsByTagName('img')
        let oImg = imgs[aaaaaaaa[0]]
        sudo_change_image_text = aaaaaaaa[1]
        image_change(oImg)
        a_Collapse?.hide()
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
    let key = fantasy_key.value.trim()
    let value = fantasy_value.value.trim()
    if (!key && !value) {
        b_Collapse?.hide()
    }
    if (key && !value) {
        fantasy_value.focus()
    }
    if (!key && value) {
        fantasy_key.value = 'fantasy'
        fantasy_value.focus()
    } else if (value) {
        let url = create_path + '?' + key + '=' + value
        let callBack = (create_id) => {
            b_Collapse?.hide()
            localStorage.id = localStorage.id + (',' + create_id)
            location.reload()
        }
        fetch(url).then(response => response.text()).then(json => callBack(json))
    }
}
const filter = () => {
    let key = fantasy_search.value
    let json = json_all.filter(item => item.a?.indexOf && (item.a?.indexOf(key) >= 0 || item.b?.toString().indexOf(key)) >= 0)
    render_data(json)
    a_Collapse?.hide()
}
const more = () => {
    more_content.style.display = more_content.style.display == 'inline-block' ? 'none' : 'inline-block'
}
const query_onhashchange = () => {
    a_Collapse?.hide()
    let key = decodeURI(get_clean_encodeurl(window.location.hash.slice(1)))
    // if (fantasy_title.innerText == '收集幻想') setTimeout(() => { fantasy_title.innerText = key || 'fantasy' }, 1000);
    // else
    fantasy_title.innerText = key || default_search_title
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
function getHashCode(str) {
    var hash = 1315423911, i, ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }
    return (hash & 0x7FFFFFFF);
}
let is_search_show_right_now = false
let is_create_show_right_now = false
const show_search_rightnow = () => { is_search_show_right_now = true }
const show_create_rightnow = () => { is_create_show_right_now = true }

btn_query.onclick = on_btn_query
btn_create.onclick = create
btn_filter.onclick = filter
btn_more.onclick = more
fantasy_title.onclick = show_search_rightnow
feather.onclick = show_create_rightnow
window.onhashchange = query_onhashchange

document.addEventListener("DOMContentLoaded", (function () {
    if (stopServiceIfDateNine()) return

    collapseb.addEventListener('shown.bs.collapse', () => {
        if (window.location.hash.slice(1) == '') fantasy_key.focus()
        else fantasy_value.focus()
    })
    collapsea.addEventListener('shown.bs.collapse', () => fantasy_search.focus())
    document.getElementById("fantasy_search").addEventListener("keyup", event => { if (event.keyCode == 13) { on_btn_query(); event.stopPropagation() } })
    document.getElementById("fantasy_value").addEventListener("keyup", event => { if (event.keyCode == 13) { create(); event.stopPropagation() } })
    document.getElementById("fantasy_key").addEventListener("keyup", event => { if (event.keyCode == 13) { create(); event.stopPropagation() } })
    document.getElementById('exampleModalLong').addEventListener('show.bs.modal', function () {
        if (document.getElementsByClassName("modal-body")[0].innerHTML.length <= 0) { let callBack = (json) => { let converter = new showdown.Converter(); document.getElementsByClassName("modal-body")[0].innerHTML = converter.makeHtml(json); }; loadJS('static/js/showdown.min.js', () => { fetch('README.md').then(response => response.text()).then(json => { callBack(json); }) }) }
    })
    document.addEventListener('click', (event) => {
        if (document.getSelection().toString().length > 0) return
        let arr = ['fantasy_key', 'fantasy_value', 'collapseb', 'fantasy_search', 'collapsea', 'btn_create']
        if (arr.indexOf(event.target.id) == -1) {
            b_Collapse?.hide()
            a_Collapse?.hide()
        }
    }, false)
    document.body.addEventListener("keyup", event => { if (event.keyCode == 13) { event.stopPropagation(); b_Collapse.show() } })

    setTimeout(() => {
        loadJS('static/js/bootstrap.min.js', () => {
            a_Collapse = new bootstrap.Collapse(collapsea, { toggle: false })
            b_Collapse = new bootstrap.Collapse(collapseb, { toggle: false })
            fantasy_title.href = '#collapsea'
            if (is_search_show_right_now) a_Collapse?.show()
            if (is_create_show_right_now) b_Collapse?.show()
        })
        save_pull('error')
    }, 100);
    save = { hide: JSON.parse(save.hide), namespace: save.namespace, error: [], default: [] }
    query_onhashchange()
}))