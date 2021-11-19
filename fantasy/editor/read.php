<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
header("Content-Encoding: gzip");
include 'config.php';

$key = $_SERVER['QUERY_STRING'];

$result = $redis->get('editor');
if ($result)
    echo gzencode($result);
else
    echo '[{"type":"paragraph","children":[{"text":""}]}]';
