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

if ($redis->get($is_backup)) {
    die;
}

try {
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $ossClient->putObject($bucket, $objectName, $result);
    $redis->set($is_backup, true);
    echo 123;
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
