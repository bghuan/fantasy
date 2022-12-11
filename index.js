const createPath = 'https://dev.bghuan.cn/api/create'
let json_all = []


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
    let json = json_all.filter(item => item.a.indexOf(key) > 0 || item.b.toString().indexOf(key) > 0)
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

btn_query.onclick = query
btn_create.onclick = create
btn_filter.onclick = filter
btn_more.onclick = more
window.onhashchange = query_onhashchange



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
