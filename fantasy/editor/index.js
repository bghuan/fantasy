let url_read = 'read.php'
let url_create = 'create.php'
let url_backup = 'backup.php'
let E
let editorConfig
let editor
let toolbar
let onFocus_ed = false

// https://www.cnblogs.com/momo798/p/9177767.html
var throttle = function (func, delay) {
    var timer = null;
    var startTime = Date.now();
    return function () {
        scroll_bottom()
        var curTime = Date.now();
        var remaining = delay - (curTime - startTime);
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        if (remaining <= 0) {
            func.apply(context, args);
            startTime = Date.now();
        } else {
            timer = setTimeout(func, remaining);
        }
    }
}

const HttpPost = (str, data, callBack, async = true) => {
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callBack(xmlhttp.responseText)
        }
    }
    xmlhttp.open("Post", str, async)
    xmlhttp.send(data)
}

let write = () => {
    data = JSON.stringify(editor.children)
    let formData = new FormData()
    formData.append('content', data)
    let callBack = function (data) { }
    HttpPost(url_create, formData, callBack)
}

let onFocus = () => {
    if (onFocus_ed) return
    editor.move(editor.getText().length);
    onFocus_ed = true
}
let scroll_bottom = (flag) => {
    setTimeout(() => {
        if (flag || (editor.getSelectionPosition().bottom && editor.getSelectionPosition().bottom == '28px')) {
            document.body.scrollTop = document.documentElement.scrollTop = document.body.scrollHeight;
        }
    }, 10);
}

let callBack_read = function (data) {
    E = window.wangEditor

    editorConfig = { MENU_CONF: {} }
    editorConfig.scroll = false
    editorConfig.onChange = throttle(write, 500)
    // editorConfig.onChange = onChange
    editorConfig.onFocus = onFocus


    editor = E.createEditor({
        selector: '#editor-text-area',
        content: JSON.parse(data),
        config: editorConfig
    })

    toolbar = E.createToolbar({
        editor,
        selector: '#editor-toolbar',
        config: { excludeKeys: 'fullScreen' }
    })

    document.getElementById('editor-text-area').addEventListener('click', e => {
        if (e.target.id === 'editor-text-area') {
            editor.blur()
            editor.focus(true)
        }
    })
    scroll_bottom(1)
}

HttpPost(url_read, null, callBack_read)

document.addEventListener('keydown', function (e) {
    if (e.key == 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        HttpPost(url_backup, null, console.log)
    }
});