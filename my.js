var a, b;
var getMyDate = function () {
    var date = new Date();
    return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString();
}
var HttpGet = function (Url, CallBack) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var json;
            try {
                json = JSON.parse(xmlhttp.responseText);
                console.log(json);
                CallBack(json);
            } catch (e) {
                CallBack(xmlhttp.responseText);
                console.log(xmlhttp.responseText + '\n' + e)
            } finally { totop() }
        }
    }
    xmlhttp.open("GET", Url, true);
    xmlhttp.send();
}
var func_query = function (json) {
    try {
        document.getElementById("a_top").innerHTML = a || 'fantasy';
        document.getElementById("a").value = a || 'fantasy';
        if (a != '' && a != undefined) {
            var str = '/&nbsp;<a onclick="query(\'' + a + '\');">' + a.substring(0, 5) + '</a>&nbsp;';
            var str_as = document.getElementById("as").innerHTML;
            document.getElementById("as").innerHTML = str_as.substring(0, str_as.indexOf(str) >= 0 ? str_as.indexOf(str) : 999);
            document.getElementById("as").innerHTML += str;
        }
        else {
            document.getElementById("as").innerHTML = '<a onclick="query()" style="margin-left:-15px;">&nbsp;&nbsp;&nbsp;</a><a class="float-right text-dark">' + getMyDate() + '</a></div>';
        }
        var div_query = document.getElementById("div_query");
        div_query.innerHTML = '';
        for (j in json) {
            var div = document.createElement("div");
            var a = document.createElement("a");
            div.className = "navbar-brand col-12 text-truncate border-bottom";
            a.onclick = function () { query(this.innerHTML) };
            a.innerHTML = json[j]['a'] || '';
            div.id = json[j]['_id']['$oid'];
            div.appendChild(a);
            var b = document.createElement("a");
            b.style = "font-size:80%";
            b.innerHTML = json[j]['b'] == null ? '' : ' - ' + json[j]['b'];
            div.appendChild(b);
            var sum = document.createElement("a");
            sum.className = "float-right";
            sum.innerHTML = json[j]['count'] || '';
            div.appendChild(sum);
            var star = document.createElement("img");
            star.className = "float-right";
            star.src = 'static/svg/s.svg';
            star.width = "15";
            star.style = "margin:10px 5px;"
            star.onclick = function () { create(this) };
            div.appendChild(star);
            div_query.appendChild(div);
        }
        var ida = document.getElementsByTagName("img");
        var str_id = localStorage.getItem('id') || '';
        for (i in ida) {
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
var query = function (str) {
    window.history.pushState(null, null, window.url);
    $('#collapsea').collapse('hide');
    a = str || document.getElementById("input_query").value;
    var url = 'https://buguoheng.com/read.php' + (a == '' ? '' : '?a=' + a);
    if (typeof str == 'object') {
        url = 'https://buguoheng.com/read.php' + '?id=' + localStorage.getItem('id') || '';
    }
    var callBack = function (json) { func_query(json); }
    //HttpGet(url, callBack);
    //window.history.replaceState(null, null, '/#/'+a);
    window.location.hash = (url || '');
    console.log('a' + a)
}
var query_onhashchange = function () { HttpGet(location.hash.slice(1), function (json) { func_query(json); }); }
$(document).ready(function () {
    window.history.replaceState(null, null, '/#/');
    window.addEventListener('hashchange', query_onhashchange, false);
    query();
});

var create = function (obj) {
    $('#collapseb').collapse('hide');
    if (obj != undefined && obj.parentNode.id != undefined) {
        var str_id = localStorage.getItem('id') || '';
        var i = str_id.indexOf(obj.parentNode.id);
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
    var url = 'https://www.buguoheng.com/create.php?a=' + a + '&b=' + JSON.stringify(b.split(","));
    var callBack = function (create_id) {
        if (create_id.length == 24) {
            localStorage.id += (',' + create_id);
            query(a);
            if (a == 'id') {
                $('#exampleModalLong').modal('show');
                $(".modal-body")[0].innerHTML = create_id;
            }
        }
    }
    HttpGet(url, callBack);
}
document.getElementsByClassName("create")[0].addEventListener("keyup", function (event) { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keyup", function (event) { if (event.keyCode == 13) { create() } })
document.getElementsByClassName("create")[1].addEventListener("keydown", function (event) { if (event.keyCode == 13) { event.preventDefault(); } })


$('#exampleModalLong').on('show.bs.modal', function () {
    var readme = document.createElement("div");
    $(readme).load("README.md", function () {
        var converter = new showdown.Converter();
        $(".modal-body")[0].innerHTML = converter.makeHtml($(readme)[0].innerHTML);
    });
})
var rmcollapseb = function () { $('#collapseb').collapse('hide') }
$('#collapseb').on('show.bs.collapse', function () {
    document.getElementById('collapseb').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', rmcollapseb, false);
})
$('#collapseb').on('hidden.bs.collapse', function () {
    document.getElementById('collapseb').removeEventListener('click', function (e) { e.stopPropagation(); });
    document.removeEventListener('click', rmcollapseb, false);
})
var rmcollapsea = function () { $('#collapsea').collapse('hide') }
$('#collapsea').on('show.bs.collapse', function () {
    document.getElementById('collapsea').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', rmcollapsea, false);
})
$('#collapsea').on('hidden.bs.collapse', function () {
    document.getElementById('collapsea').removeEventListener('click', function (e) { e.stopPropagation(); });
    document.removeEventListener('click', rmcollapsea, false);
})


var totop = function () { $('body,html').animate({ scrollTop: '0px' }); }
var tobottom = function () { $('body,html').animate({ scrollTop: $(".footer").offset().top }); }