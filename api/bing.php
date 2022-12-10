<?php

// header('Access-Control-Allow-Origin:*.bghuan.cn');
// header('Access-Control-Allow-Origin:*');
header("Content-type: image/jpg");

include 'config.php';

if (!$redis->get("bing")) {
    $s = file_get_contents("https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1");
    $s = json_decode($s, true);
    $s = 'https://cn.bing.com/' . $s['images'][0]['url'];
    $s = file_get_contents($s);
    $redis->set("bing", $s);
    $times = mktime(23, 59, 59) - mktime(date('H'), date('i'), date('s'));
    $redis->expire("bing", $times);
}

$times = mktime(23, 59, 59) - mktime(date('H'), date('i'), date('s'));
header ("Cache-Control: max-age=$times");

echo $redis->get("bing");
