<?php
include 'config.php';

$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    'key' => $key,
    'value' => $value,
    'date' => date("Y-m-d h:i:sa")
];
$_id = $bulk->insert($document);
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
echo $_id;
