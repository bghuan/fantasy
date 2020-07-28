<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

if (is_file(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use OSS\OssClient;
use OSS\Core\OssException;

$objectName = $objectDir . $db_name . '.' . $db_document . '.json';

// $object .= '?timestamp=' . time();

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
// $redis->set("isBuckuped",false);
$isBuckuped = $redis->get("isBuckuped");
// echo $isBuckuped;

if ($isBuckuped) {
    die;
}

$query = new MongoDB\Driver\Query([], []);

try {
    $json = json_encode($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray());

    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);

    $ossClient->putObject($bucket, $objectName, $json);
    // $ossClient->uploadFile($bucket, "dsc.tzr.gz", "temp.tar.gz");

    // print(__FUNCTION__ . ": OK" . "\n");
    // print(__FUNCTION__ . "https://oss.buguoheng.com/" . $object . "\n");
    // echo $json;
    $redis->set("isBuckuped", true);
    exit;
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
