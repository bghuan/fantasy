
let stop_service = false
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
    connect(ws_url, decodeURI(window.location.hash.slice(1)) || 'gnrioabneruiafru')
}))