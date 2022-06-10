<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

if (is_file(__DIR__ . '/../../php/vendor/autoload.php')) {
    require_once __DIR__ . '/../../php/vendor/autoload.php';
}

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
    $redis->set("is_editor_backuped", true);
    echo 123;
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
