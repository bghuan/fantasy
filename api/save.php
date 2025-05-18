<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
header("Content-Encoding: gzip");
include 'config.php';

$namespace = querystring('namespace');
$key = querystring("key");
$value = querystring("value");
$prix = querystring("prix");
$format = querystring("format");
$savelalala = querystring("savelalala");
$keyvalue = $_POST ? $_POST : $_GET;

$key_prix = $_SERVER['PHP_SELF'] . '.' . (empty($namespace) ? '' : $namespace . '.');
$my_key = $key_prix . $key;
$array = array();

// var_dump($keyvalue);
// exit;

if (!empty($key)) {
    if (empty($value)) {
        $result = $redis->get($my_key);
    }
} else {
    foreach ($keyvalue as $key => $value) {
        $my_key = $key_prix . $key;
        if (empty($value)) {
            $value = $redis->get($my_key);
            $value = ($value == false && !$redis->exists($my_key)) ? null : $value;
        } else {
            $redis->set($my_key, $value);
            if (!empty($savelalala) && $namespace != $key && $savelalala != $key)
                $redis->set($my_key. '.' .date('YmdHis', time()), $value);
        }
        $array[$key] = $value;
    }
    $result = json_encode2($array);
}
if($format=="string") {
    header('Content-type: text/plain; charset=utf-8');
    echo gzencode($value);}
else 
echo gzencode($prix . $result);

try {
    $timestamp = time();
    $formatted_time = date('YmdHis', $timestamp);
    $my_key2 = str_replace(':', '', str_replace('/', '', $my_key));
    $objectName = 'backup/' . $my_key2 . $formatted_time . '.json';
    $result = json_encode2($array);
    $f = fopen($objectName, "w");
    fwrite($f, $result);
    fclose($f);
    // echo gzencode($objectName);
} catch (e) {
    gzencode(var_dump((e)));
}