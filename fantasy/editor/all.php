<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';
$arList = $redis->keys("editor.*");
$i = 0;
foreach ($arList as $item) {
    $value = str_replace('editor.', '', urldecode($item));
    if (!empty($value)) $array[$i++] = $value;
}
echo '<script>let list=' . json_encode2($array) . '</script>';
?>
<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fantasy editor</title>
    <link href="milligram.css" rel="stylesheet">
</head>

<body>
    <script>
        list.sort()
        let li_array = []
        for (let i = 0; i < list.length; i++) {
            var _item = list[i].replace('editor.', '')
            if (!_item) continue
            let li = document.createElement('li')
            let a = document.createElement('a')
            a.href = './?' + _item
            a.innerText = _item
            li.appendChild(a)
            li_array.push(li)
        }
        let ul
        for (let i = 0; i < li_array.length; i++) {
            if (i % 18 == 0) {
                ul = document.createElement('ul')
                ul.style.float = 'left'
                ul.style.marginRight = '10px'
                ul.style.width = '200px'
                document.body.appendChild(ul)
            }
            let li = li_array[i]
            ul.appendChild(li)
        }
        // list.sort()
        // let li_array = []
        // list = list.filter(item => item.replace('editor.', ''))
        // for (let i = 0; i < list.length; i++) {
        //     var _item = list[i].replace('editor.', '')
        //     li_array.push("<li><a href='./?" + _item + "'>" + _item + "<a/></li>")
        //     ul.innerHTML += "<li><a href='./?" + _item + "'>" + _item + "<a/></li>"
        // }
    </script>
</body>

</html>