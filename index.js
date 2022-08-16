const createPath = 'https://dev.buguoheng.com/api/create'

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
    let json_current = []
    for (let item of fantasy_content.children)
        if (item.innerText.indexOf(fantasy_search.value) > -1)
            json_current.push(item)
    fantasy_content.innerText = ''
    for (let i = 0; i < json_current.length; i++)
        fantasy_content.appendChild(json_current[i])
    a_Collapse.hide()
}
const more = () => {
    more_content.style.display = more_content.style.display == 'inline-block' ? 'none' : 'inline-block'
}
const content = (event) => {
    if (event.target.nodeName == 'A')
        query(fantasy_search.value = (event.target.parentNode.lastChild.innerText))
    else if (event.target.lastChild?.nodeName == 'A')
        query(fantasy_search.value = (event.target.lastChild.innerText))
}
const query_onhashchange = () => {
    a_Collapse.hide()
    let key = decodeURI(window.location.hash.slice(1))
    if (!key) return (fantasy_content.innerHTML = json_all_innerHTML)
    fantasy_title.innerText = key
    fantasy_search.value = key
    fantasy_key.value = key
    let json = json_all.filter(item => item[key])
    let innerText = ''
    for (let i = 0; i < json.length; i++) innerText += '<div><a>' + json[i][key] + '</a></div>'
    fantasy_content.innerHTML = innerText
}

btn_query.onclick = query
btn_create.onclick = create
btn_filter.onclick = filter
btn_more.onclick = more
window.onhashchange = query_onhashchange
fantasy_content.onclick = content



a_Collapse = new bootstrap.Collapse(collapsea, { toggle: false })
b_Collapse = new bootstrap.Collapse(collapseb, { toggle: false })

let json_all = []
let json_all_child = []
for (let item of fantasy_content.children) {
    let key = item.children[1].innerText
    let value = item.children[0].innerText
    json_all.push({ [key]: value })
}
let json_all_innerHTML = fantasy_content.innerHTML
if (window.location.hash.slice(1)) query_onhashchange()
