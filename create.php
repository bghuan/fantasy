<?php
header('Access-Control-Allow-Origin:*');

if (empty($_GET["a"]) || empty($_GET["b"])) {
    echo "empty";
    exit;
}
if (!is_array($_GET["b"])) {
    echo "b should be an Array";
    exit;
}
if (strstr($_GET["a"], '$') || strstr($_GET["b"], '$')) {
    echo "pleace not type $";
    exit;
}

$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    '_id' => new MongoDB\BSON\ObjectID,
    'a' => $_GET["a"],
    'b' => $_GET["b"]
];

$_id = $bulk->insert($document);

$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite('adb.a', $bulk, $writeConcern);

if ($result) {
    echo "insert success";
    exit;
} else {
    echo "insert failed";
    exit;
}
?>