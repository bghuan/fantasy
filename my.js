var a, b;
const getMyDate = (date = new Date()) => (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString();

const HttpGet = (str, CallBack) => {
    console.log(str);
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let json;
            try {
                json = JSON.parse(xmlhttp.responseText);
                console.log(json);
                CallBack(json);
            } catch (e) {
                CallBack(xmlhttp.responseText);
                console.log(xmlhttp.responseText + '\n' + e)
            } finally {
                totop()
            }
        }
    }
    xmlhttp.open("GET", "https://buguoheng.com" + (str || "/read.php"), true);
    xmlhttp.send();
}
const func_query = (json) => {
    try {
        document.getElementById("a_top").innerHTML = a || 'fantasy';
        document.getElementById("a").value = a || 'fantasy';
        if (a != '' && a != undefined) {
            let str = '/&nbsp;<a onclick="query(\'' + a + '\');">' + a.substring(0, 5) + '</a>&nbsp;';
            let str_as = document.getElementById("as").innerHTML;
            document.getElementById("as").innerHTML = str_as.substring(0, str_as.indexOf(str) >= 0 ? str_as.indexOf(str) : 999);
            document.getElementById("as").innerHTML += str;
        }
        else {
            document.getElementById("as").innerHTML = '<a onclick="query()" style="margin-left:-15px;">&nbsp;&nbsp;&nbsp;</a><a class="float-right text-dark">' + getMyDate() + '</a></div>';
        }
        let div_query = document.getElementById("div_query");
        div_query.innerHTML = '';
        for (j in json) {
            let div = document.createElement("div");
            let aa = document.createElement("a");
            div.className = "navbar-brand col-12 text-truncate border-bottom";
            aa.onclick = function () { query(this.innerHTML) };
            aa.innerHTML = json[j]['a'] || '';
            div.id = json[j]['_id']['$oid'];
            div.appendChild(aa);
            let b = document.createElement("a");
            b.style = "font-size:80%";
            b.innerHTML = json[j]['b'] == null ? '' : ' - ' + json[j]['b'];
            div.appendChild(b);
            let sum = document.createElement("a");
            sum.className = "float-right";
            sum.innerHTML = json[j]['count'] || '';
            div.appendChild(sum);
            let star = document.createElement("img");
            star.className = "float-right";
            star.src = 'static/svg/s.svg';
            star.width = "15";
            star.style = "margin:10px 5px;";
            star.onclick = function () { create(this) };
            div.appendChild(star);
            div_query.appendChild(div);
        }
        let ida = document.getElementsByTagName("img");
        let str_id = localStorage.getItem('id') || '';
        for (let i in ida) {
            if (ida[i].parentNode != undefined && ida[i].parentNode.id != undefined && ida[i].parentNode.id != '' && str_id.indexOf(ida[i].parentNode.id) >= 0) {
                ida[i].src = "static/svg/star.svg";
            }
        }
        document.getElementById("input_query").value = '';
    }
    catch (e) {
        console.log('error:' + e)
    }
}
const query2 = str => {
    $('#collapsea').collapse('hide');
    a = str || '';
    let url = (a == '' ? '' : '/read.php?a=' + a);
    if (typeof str == 'object') {
        url = "/read.php" + '?id=' + localStorage.getItem('id') || '';
    }
    var callBack = json => func_query(json);
    HttpGet(url, callBack);
}
const query = str => {
    $('#collapsea').collapse('hide');
    a = str || '';
    let url = (a == '' ? '' : '/read.php?a=' + a);
    console.log(typeof str);
    if (typeof str == 'object') {
        url = "/read.php" + '?id=' + localStorage.getItem('id') || '';
    }
    window.location.hash = url;
    if (a == '' && typeof str != 'object') { window.history.replaceState(null, null, 'https://buguoheng.com'); }
}
const query_onhashchange = () => { a = decodeURI(location.href).split('a=')[1] || ''; HttpGet(location.hash.slice(1), json => func_query(json)); }
$(document).ready(function () {
    window.history.replaceState(null, null, (decodeURI(location.href).split('a=')[1] == null) ? '' : "/#" + location.hash.slice(1));
    query_onhashchange();
    window.addEventListener('hashchange', query_onhashchange, false);
});
const create = obj => {
    $('#collapseb').collapse('hide');
    if (obj != undefined && obj.parentNode.id != undefined) {
        let str_id = localStorage.getItem('id') || '';
        let i = str_id.indexOf(obj.parentNode.id);
        if (i >= 0) {
            localStorage.id = str_id.substring(0, i) + str_id.substring(i + obj.parentNode.id.length);
            query([]);
            return;
        }
        if (a == '') {
            a = obj.parentNode.childNodes[0].innerHTML;
            b = [];
        }
        else {
            b = obj.parentNode.childNodes[0].innerHTML;
        }
    }
    else {
        a = document.getElementById("a").value;
        b = document.getElementById("b").value;
    }
    if (a == '') { alert("please type a object") }
    let url = '/create.php?a=' + a + '&b=' + JSON.stringify(b.split(","));
    let callBack = create_id => {
        if (create_id.length == 24) {
            localStorage.id += (',' + create_id);
            query(a);
            query2(a);
            if (a == 'id') {
                $('#exampleModalLong').modal('show');
                $(".modal-body")[0].innerHTML = create_id;
            }
        }
        else {
            console.log('not right id,' + create_id)
        }
    }
    HttpGet(url, callBack);
}
document.getElementById("input_query").addEventListener("keyup", event => { if (event.keyCode == 13) { query(document.getElementById("input_query").value) } })
document.getElementsByClassName("create")[0].addEventListener("keyup", event => { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keyup", event => { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keydown", event => { if (event.keyCode == 13) { event.preventDefault(); } })

let i = 0;
let enter_keycode = [69, 78, 84, 69, 82];
document.addEventListener('keyup', event => {
    if (event.keyCode == enter_keycode[i]) {
        if (i++ == 4) {
            $('#collapseb').collapse('show');
            i = 0;
        }
    }
    else {
        i = 0;
    }
}, true);


$('#exampleModalLong').on('show.bs.modal', function () {
    let readme = document.createElement("div");
    $(readme).load("README.md", function () {
        let converter = new showdown.Converter();
        $(".modal-body")[0].innerHTML = converter.makeHtml($(readme)[0].innerHTML);
    });
})
const rmcollapseb = () => $('#collapseb').collapse('hide');
$('#collapseb').on('show.bs.collapse', function () {
    document.getElementById('collapseb').addEventListener('click', e => { e.stopPropagation(); });
    document.addEventListener('click', rmcollapseb, false);
})
$('#collapseb').on('hidden.bs.collapse', function () {
    document.getElementById('collapseb').removeEventListener('click', e => { e.stopPropagation(); });
    document.removeEventListener('click', rmcollapseb, false);
})
const rmcollapsea = () => { $('#collapsea').collapse('hide') }
$('#collapsea').on('show.bs.collapse', function () {
    document.getElementById('collapsea').addEventListener('click', e => { e.stopPropagation(); });
    document.addEventListener('click', rmcollapsea, false);
})
$('#collapsea').on('hidden.bs.collapse', function () {
    document.getElementById('collapsea').removeEventListener('click', e => { e.stopPropagation(); });
    document.removeEventListener('click', rmcollapsea, false);
})


const totop = () => $('body,html').animate({ scrollTop: '0px' });
const tobottom = () => $('body,html').animate({ scrollTop: $(".footer").offset().top }); 