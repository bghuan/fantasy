<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';
require_once 'aliysun-oss-php-sdk-2.5.0.phar/../autoload.php';

use OSS\OssClient;
use OSS\Core\OssException;

$objectName = $objectDir . $db_name . '.' . $db_document . '.json';

if ($redis->get("isBuckuped")) {
    die;
}

try {
    $json = json_encode($manager->executeQuery($db_name . '.' . $db_document, new MongoDB\Driver\Query([], []))->toArray());
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $ossClient->putObject($bucket, $objectName, $json);
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
