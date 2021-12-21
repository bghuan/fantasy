<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
// header("Content-Encoding: gzip");
include 'config.php';

$result = $redis->set($key, $content);
echo $result;
$redis->set($is_backup, false);