<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';
$a = FormitDollor($_GET["a"]);
$b = FormitDollor($_GET["b"]);
if (empty($b)) {
    $b = [];
} else {
    $b = json_decode($b);
}
if (empty($a)) {
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
$result = $manager->executeBulkWrite($db_document, $bulk, $writeConcern);
if ($result) {
    echo $document["_id"];
    exit;
}
$isBuckuped = false;
