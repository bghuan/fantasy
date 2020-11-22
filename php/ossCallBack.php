<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

$i = $redis->get("callback");
$redis->set("callback", $i+1);
echo ++$i;
