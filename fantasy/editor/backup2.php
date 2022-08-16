<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

$objectName = 'backup/' . $key . '.json';
$result = json_encode2($redis->get($key));
$f = fopen($objectName, "w");
fwrite($f, $result);
fclose($f);
echo 123;
