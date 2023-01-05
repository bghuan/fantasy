<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';
require_once 'aliysun-oss-php-sdk-2.5.0.phar/../autoload.php';

use OSS\OssClient;
use OSS\Core\OssException;
$ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);

$arList = $redis->keys("editor.*");
foreach ($arList as $item) {
    $key = urldecode($item);
    $objectName = $objectDir . $key . '.json';
    $result = json_encode2($redis->get($key));
$is_backup = "is_editor.".$key.".backuped";

    // echo ($is_backup) . '-----' . $redis->get($is_backup);
    if (!$redis->get($is_backup)) {
        try {
            echo $key.'未备份,正在备份---';
            $ossClient->putObject($bucket, $objectName, $result);
            $redis->set($is_backup, true);
        } catch (OssException $e) {
            printf(__FUNCTION__ . ": FAILED\n");
            printf($e->getMessage() . "\n");
        }
    }
    // echo '</br>';
}