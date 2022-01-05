<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

// $a = $_GET["a"];
// $b = $_GET["b"];

$a = $_POST["a"];

if (empty($a)) {
    exit;
}

$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    '_id' => new MongoDB\BSON\ObjectID,
    'a' => $a,
    'b' => $b
];

$filter = ['a' => ['$eq' => $a]];
$options = ['sort' => ['_id' => -1]];
$query = new MongoDB\Driver\Query($filter, $options);
echo (json_encode2($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));