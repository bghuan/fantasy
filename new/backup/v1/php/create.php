<?php
include 'config.php';

$key = $_POST["key"] ? $_POST["key"] : $_GET["key"];
$value = $_POST["value"] ? $_POST["value"] : $_GET["value"];

$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    'key' => $key,
    'value' => $value
];
$_id = $bulk->insert($document);
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
echo $_id;
