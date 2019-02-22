var a, b, id = [], qs = {};
window.onload = function () {
    id = qs.get('id') == null ? [] : qs.get('id').split(',');
    query();
}
var getMyDate = function () {
    var date = new Date();
    return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).toString();
}
qs.get = function (name) {
    var reg = new RegExp("[?&#]" + name + "=[^$&]*");
    var parameter = location.href.match(reg)
    if (!parameter) {
        return;
    }
    return decodeURIComponent(parameter[0].substr(name.length + 2));
}
qs.set = function (name, value) {
    var reg = new RegExp("([?&#]" + name + "=)[^$&]*")
    var url = location.href
    var parameter = url.match(reg)
    if (parameter) {
        url = url.replace(reg, '$1' + value)
    } else {
        var first = url.indexOf('#') > 0 ? '' : '#'
        url += (url.indexOf('=') > 0 ? '&' : first) + name + '=' + value
    }
    history.replaceState && history.replaceState(null, null, url)
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
            }
            catch (e) {
                CallBack(xmlhttp.responseText);
                console.log(xmlhttp.responseText + '\n' + e)
            }
        }
    }
    xmlhttp.open("GET", Url, true);
    xmlhttp.send();
}
var func_query = function (json) {
    var div_query = document.getElementById("div_query");
    div_query.innerHTML = '';
    for (j in json) {
        var div = document.createElement("div");
        var a = document.createElement("a");
        div.className = "navbar-brand col-12 text-truncate border-bottom";
        a.onclick = function () { query(this.innerHTML) };
        a.innerHTML = json[j]['a'] == null ? '' : json[j]['a'];
        div.id = json[j]['_id']['$oid'];
        div.appendChild(a);
        var b = document.createElement("a");
        b.style = "font-size:80%";
        b.innerHTML = json[j]['b'] == null || json[j]['b'] == '' ? '' : ' - ' + json[j]['b'];
        div.appendChild(b);
        var sum = document.createElement("a");
        sum.className = "float-right";
        sum.innerHTML = json[j]['count'] == null ? '' : json[j]['count'];
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
    for (i in ida) {
        for (j in id) {
            if (ida[i].parentNode != undefined && ida[i].parentNode.id != undefined && ida[i].parentNode.id != '' && ida[i].parentNode.id == id[j]) {
                ida[i].src = "static/svg/star.svg";
            }
        }
    }
}
var query = function (str) {
    a = (str != undefined ? str : document.getElementById("input_query").value);
    var url = 'https://buguoheng.com/read.php' + (a == '' ? '' : '?a=' + a);
    if (typeof str == 'object') {
        url = 'https://buguoheng.com/read.php' + (id == '' ? '' : '?id=' + id);
    }
    var callBack = function (json) {
        document.getElementById("a_top").innerHTML = (a == '' ? 'fantasy' : a);
        document.getElementById("a").value = (a == '' ? 'fantasy' : a);
        if (a != '') {
            var str = '/&nbsp;<a onclick="query(\'' + a + '\');">' + a.substring(0, 5) + '</a>&nbsp;';
            var str_as = document.getElementById("as").innerHTML;
            document.getElementById("as").innerHTML = str_as.substring(0, str_as.indexOf(str) >= 0 ? str_as.indexOf(str) : 999);
            document.getElementById("as").innerHTML += str;
        }
        else {
            document.getElementById("as").innerHTML = '<a onclick="query()" style="margin-left:-15px;">&nbsp;&nbsp;&nbsp;</a><a class="float-right text-dark">' + getMyDate() + '</a></div>';
        }
        func_query(json);
        document.getElementById("input_query").value = '';
    }
    HttpGet(url, callBack);
}
var create = function (obj) {
    if (obj != undefined && obj.parentNode.id != undefined) {
        for (j in id) {
            if (obj.parentNode.id == id[j]) {
                obj.src = "static/svg/s.svg";
                id[j] = null;
                var arr = [];
                for (j in id) { if (id[j] != null && id[j] != '') { arr.push(id[j]); } }
                id = arr;
                qs.set('id', id);
                return;
            }
        }
        obj.src = "static/svg/star.svg";
        a = obj.parentNode.childNodes[0].innerHTML;
        b = [];
    }
    else {
        a = document.getElementById("a").value;
        b = JSON.stringify(document.getElementById("b").value.split(","));
    }
    if (a == '') { alert("please type a object") }
    var url = 'https://www.buguoheng.com/create.php?a=' + a + '&b=' + b;
    var callBack = function (create_id) {
        id.push(create_id);
        qs.set('id', id);
        query(a);
    }
    HttpGet(url, callBack);
}
document.getElementsByClassName("create")[0].addEventListener("keyup",function(event){if(event.keyCode==13){create()}})
document.getElementsByClassName("create")[1].addEventListener("keyup",function(event){if(event.keyCode==13){create()}})
document.getElementsByClassName("create")[1].addEventListener("keydown",function(event){if(event.keyCode==13){event.preventDefault();}})