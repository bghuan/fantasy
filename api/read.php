<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
header("Content-Encoding: gzip");
include 'config.php';

try {
    $filter = [];
    $option = ['sort' => ['_id' => -1], 'projection' => ['_id' => 0]];
    $json = json_encode2($manager->executeQuery($db_name . '.' . $db_document, new MongoDB\Driver\Query($filter, $option))->toArray());
    echo gzencode($json);
    exit;
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
}