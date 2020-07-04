<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: text/html; charset=utf-8');
include 'config.php';

if (is_file(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use OSS\OssClient;
use OSS\Core\OssException;

$object .= '?timestamp=' . time();
if ($isBuckuped) {
    die;
} else {
    $isBuckuped = true;
}

$cmd = new MongoDB\Driver\Command([
    'aggregate' => 'a',
    'pipeline' => [
        ['$match' => ['a' => ['$exists' => true], 'b' => ['$exists' => true, '$nin' =>  ['', [], [''], [[]]]]]],
        ['$sort' => ['_id' => -1]],
        ['$project' => ['_id' => '$_id', 'a' => '$a', 'b' => '$b']]
    ],
    'cursor' => new stdClass,
]);
try {
    $json = json_encode($manager->executeCommand($db_name, $cmd)->toArray());

    $myfile = fopen("bdb.json", "w") or die("Unable to open file!");
    fwrite($myfile, $json);
    fclose($myfile);


    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);

    $ossClient->uploadFile($bucket, $object, $filePath);

    // print(__FUNCTION__ . ": OK" . "\n");
    print(__FUNCTION__ . "https://oss.buguoheng.com/" . $object . "\n");
    // echo $json;
    exit;
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
} catch (OssException $e) {
    printf(__FUNCTION__ . ": FAILED\n");
    printf($e->getMessage() . "\n");
    return;
}
