
let host = location.origin
if (host.toString().indexOf('127') >= 0 || host.toString().indexOf('localhost') >= 0) host = 'https://dev.bghuan.cn'
let path = host + '/fantasy/editor/'

let url_read = path + 'read.php' + window.location.search
let url_create = path + 'create.php' + window.location.search
let url_backup = path + 'backup.php' + window.location.search
let url_backup2 = path + 'backup2.php' + window.location.search
let E
let editorConfig
let SlateTransforms
let editor
let toolbar
let onFocus_ed = false
let time_backup
let time_tick_backup = 200
let last_data = ''

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
    if (last_data == data) return
    last_data = data
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
            if (editor.children.length > 10)
                document.documentElement.scrollTop = document.body.scrollHeight;
        }
    }, 10);
}

let callBack_read = function (data) {
    E = window.wangEditor
    SlateTransforms = E.SlateTransforms

    editorConfig = { MENU_CONF: {} }
    editorConfig.scroll = false
    editorConfig.onChange = throttle(write, 500)
    // editorConfig.onChange = onChange
    editorConfig.onFocus = onFocus

    if (data) {
        editor = E.createEditor({
            selector: '#editor-text-area',
            content: JSON.parse(data),
            config: editorConfig
        })
        last_data = data
    } else {
        editor = E.createEditor({
            selector: '#editor-text-area',
            config: editorConfig
        })
    }

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

    // document.getElementById('w-e-textarea-1').style.marginLeft = '200px'
}

HttpPost(url_read, null, callBack_read)

document.addEventListener('keydown', function (e) {
    if (e.key == 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        let is_save_force_oss = (new Date().getTime() - time_backup < time_tick_backup)
        let url = is_save_force_oss ? url_backup : url_backup2
        e.preventDefault();
        var callBack = function (result) {
            console.log(result)
            setTimeout(function () {

                if (!is_save_force_oss && result == '123')
                    alert('保存成功')
            }, time_tick_backup)
        }
        HttpPost(url, null, callBack)
        time_backup = new Date().getTime()
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key == 'r' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        var callBack = function (data) {
            editor.select([])
            editor.deleteFragment()
            E.SlateTransforms.insertNodes(editor, data)
        }
        write = null
        setInterval(() => {
            fetch(url_read)
                .then(response => response.json())
                .then(json => callBack(json))
        }, 1000);
    }
});
rtrim = function (data) {
    return data < 10 ? '0' + data : data
}
var getDate = function (date = new Date()) {
    return date.getFullYear() + '-' + rtrim(date.getMonth() + 1) + '-' + rtrim(date.getDate())
}
var getTime = function (date = new Date()) {
    return rtrim(date.getHours()) + ":" + rtrim(date.getMinutes()) + ":" + rtrim(date.getSeconds())
}
document.addEventListener('keydown', function (e) {
    if (((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))) {
        if (e.key == 'b') {
            e.preventDefault();
            document.getElementById('w-e-textarea-1').style.backgroundColor = '#000'
            document.getElementById('w-e-textarea-1').style.color = "#FFF"
        }
        if (e.key == 'd' || e.key == 'Enter') {
            e.preventDefault();
            E.SlateTransforms.insertNodes(editor, [{ type: 'paragraph', children: [{ text: getDate() + ' ' }] }])
        }
        if (e.key == 'q') {
            location.href = 'https://bghuan.cn/fantasy/editor/all.php'
        }
    }
    else if (e.key == 'Enter') {
        editor.moveReverse(1) // 反向移动 2 个字符
        var flag = editor.getText().indexOf(getDate()) != -1
        E.SlateTransforms.insertNodes(editor, [{ type: 'paragraph', children: [{ text: (!flag ? getDate() : getTime()) + ' ' }] }])
    }
});
document.title = window.location.search.replace('?', '')

if (window.location.search == "?all") {
    location.href = host + '/fantasy/editor/all'
}