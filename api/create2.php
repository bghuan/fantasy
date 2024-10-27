<?php
header('Access-Control-Allow-Origin:*');
include_once 'config.php';

$a = querystring('a');
$b = querystring('b');
if (empty($a) && empty($b)) {
    $keyvalue = $_POST ? $_POST : $_GET;
    if (count($keyvalue) > 0) {
        $a = (array_keys($keyvalue)[0]);
        $b = (array_values($keyvalue)[0]);
    }
}

if (!empty($a)) {
    $bulk = new MongoDB\Driver\BulkWrite;
    $document = [
        '_id' => new MongoDB\BSON\ObjectID,
        'a' => $a,
        'b' => $b
    ];
    $_id = $bulk->insert($document);
    $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
    $result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
    if ($result) {
        echo $document["_id"];
        $redis->set("isBuckuped", false);
    }
}

require_once 'aliyun-oss-php-sdk-2.5.0.phar';

use OSS\OssClient;
use OSS\Core\OssException;

$namespace = querystring('namespace');
$prix = querystring("prix");
$objectName = $objectDir . $db_name . '.' . $db_document . '.' . $namespace . '.json';
$option = ['sort' => ['_id' => -1], 'projection' => ['_id' => 0]];

try {
    $json = $prix . json_encode2($manager->executeQuery($db_name . '.' . $db_document, new MongoDB\Driver\Query([], $option))->toArray());
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $ossClient->putObject($bucket, $objectName, $json);
    exit;
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}