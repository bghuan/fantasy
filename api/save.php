<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
include 'config.php';

$namespace = querystring('namespace');
$keyvalue = $_POST ? $_POST : $_GET;
$prix = $_SERVER['PHP_SELF'] . '.' .(empty($namespace)?'':$namespace.'.');
$array = array();


$key = querystring("key");
$my_key = $prix . $key;
$value = querystring("value");
if(!empty($key)){
if(empty($value)){
echo $redis->get($my_key);
exit;
}
echo $redis->set($my_key,$value);
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

echo json_encode2($array);
