<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
// header("Content-Encoding: gzip");
include 'config.php';

// $key = $_SERVER['QUERY_STRING'];
$key = $_POST['content'];

$result = $redis->set('editor',$key);
echo $result;
$redis->set("is_editor_backuped", false);