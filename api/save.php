<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
header("Content-Encoding: gzip");
include 'config.php';

$namespace = querystring('namespace');
$key = querystring("key");
$value = querystring("value");
$keyvalue = $_POST ? $_POST : $_GET;

$prix = $_SERVER['PHP_SELF'] . '.' . (empty($namespace) ? '' : $namespace . '.');
$my_key = $prix . $key;
$array = array();

// var_dump($keyvalue);
// exit;

if (!empty($key)) {
    if (empty($value)) {
        echo $redis->get($my_key);
        exit;
    }
    echo $redis->set($my_key, $value);
    exit;
}

foreach ($keyvalue as $key => $value) {
    $my_key = $prix . $key;
    if (empty($value)) {
        $value = $redis->get($my_key);
        $value = ($value == false && !$redis->exists($my_key)) ? null : $value;
    } else {
        $redis->set($my_key, $value);
    }
    $array[$key] = $value;
}

echo gzencode(json_encode2($array));