<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

if (is_file(__DIR__ . '/../../php/vendor/autoload.php')) {
    require_once __DIR__ . '/../../php/vendor/autoload.php';
}

use OSS\OssClient;
use OSS\Core\OssException;

$objectName = $objectDir . 'editor.json';
$result = json_encode2($redis->get('editor'));

if ($redis->get("is_editor_backuped")) {
    die;
}

try {
    $result = json_encode2($redis->get('editor'));
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $ossClient->putObject($bucket, $objectName, $result);
    $redis->set("is_editor_backuped", true);
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
