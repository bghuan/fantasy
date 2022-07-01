<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
include 'config.php';

$namespace = $_POST["namespace"] ? $_POST["namespace"] : $_GET["namespace"];
$keyvalue = $_POST ? $_POST : $_GET;
$prix = $_SERVER['PHP_SELF'] . '.' . $namespace . '.';
$array;

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

echo json_encode2($array);