<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

// $a = $_GET["a"];
// $b = $_GET["b"];

$a = $_POST["a"];
$b = $_POST["b"];

if (empty($a)||empty($b)) {
    exit;
}

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
}
