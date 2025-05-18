<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';
require_once 'aliysun-oss-php-sdk-2.5.0.phar/../autoload.php';

use OSS\OssClient;
use OSS\Core\OssException;

$objectName = $objectDir . $key .'.json';
$result = json_encode2($redis->get($key));

try {
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $ossClient->putObject($bucket, $objectName, $result);
    echo 123;
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
