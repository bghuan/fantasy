<?php
include 'config.php';

$used_message = '该链接已使用';
$key=$prix.$_GET['key'];

$i = $redis->get($key);
$redis->set($key, $i+1);
