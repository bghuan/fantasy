<?php
header('Access-Control-Allow-Origin:*');

$a = $_GET["a"];
$b = empty($_GET["b"]) ? [] : json_decode($_GET["b"]);
if (empty($a)) {
    echo "empty";
    exit;
}
if (!is_array($b)) {
    echo "b should be an Array";
    exit;
}
if (strstr($a, '$') || strstr(json_encode($b), '$')) {
    echo "pleace not type $";
    exit;
}

$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    '_id' => new MongoDB\BSON\ObjectID,
    'a' => $a,
    'b' => $b
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