<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
// header("Content-Encoding: gzip");
include 'config.php';

$result = $redis->get($key);
if ($result)
    echo ($result);
else
    echo '[{"type":"paragraph","children":[{"text":""}]}]';
