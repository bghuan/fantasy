<?php
header('Access-Control-Allow-Origin:*');

$a = $_GET["a"];
$b = $_GET["b"];

$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$pageSize = 100;

if (empty($a)) {
    $filter = [
        'a' => ['$type' => 2]
    ];
    $options = [
        'projection' => [
            '_id' => 1,
            'a' => 1
        ],
        'sort' => ['_id' => -1],
        'limit' => $pageSize
    ];
} else {
    $filter = ['a' => $a];
    $options = [
        'projection' => [
            '_id' => 1,
            'a' => 1,
            'b' => 1
        ],
        'sort' => ['_id' => -1],
        'limit' => $pageSize
    ];
    //$filter = ['a' => ['$regex' => $a,'$options' => '$i']];
}
// if (empty($b)) {
//     $filter = [];
// } else {
//     $filter = ['_id' => ['$in' => [$b]]];
// }
// $filter  = ['_id' => $id];
// $options = [];
$query = new MongoDB\Driver\Query($filter, $options);
$cursor = $manager->executeQuery('adb.a', $query);
$arr = [];
foreach ($cursor as $document) {
    $bson = MongoDB\BSON\fromPHP($document);
    $arr[] = json_decode(MongoDB\BSON\toJSON($bson));
}
//$document = json_decode(json_encode($document),true);
// // echo $document[name];
// $scents = current($cursor->toArray())->values; // get the distinct values as an array

echo json_encode($arr);
?>