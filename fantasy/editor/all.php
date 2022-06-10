<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';
$arList = $redis->keys("editor.*");
echo '<link href="milligram.css" rel="stylesheet">';
echo "<ul>";
foreach ($arList as $item) {
    $host=$_SERVER['HTTP_HOST'];
    $item=str_replace('editor.','',urldecode($item));
    $url=str_replace('all.php','?'.$item,$_SERVER['PHP_SELF']);
    echo "<li><a href='https://$host$url'>$item</a></li>";
}
echo "</ul>";
exit;
echo '<script>let list=' . json_encode2($arList) . '</script>';
?>
<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fantasy editor</title>
    <link href="milligram.css" rel="stylesheet">
    <!-- <link href="index.css" rel="stylesheet"> -->
</head>

<body>
    <ul id="ul"> </ul>
    <script>
        list.sort()
        let text = ""
        list.forEach(function(item) {
            text += "<li>" + item + "</li>"
        })
        ul.innerHTML = text
    </script>
</body>

</html>