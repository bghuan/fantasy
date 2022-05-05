<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

$key = $_GET["key"];
$value = $_GET["value"];
if(empty($value)){
echo $redis->get($key);
exit;
}
echo $redis->set($key,$value);
