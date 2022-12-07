<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

$timestamp = time();
$formatted_time = date('Y.m.d.H.i.s', $timestamp);
$objectName = 'backup/' . $key . '.' . $formatted_time . '.json';
$result = json_encode2($redis->get($key));
$f = fopen($objectName, "w");
fwrite($f, $result);
fclose($f);
echo 123;
