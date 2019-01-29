<?php
header('Access-Control-Allow-Origin:*');
$a = $_GET["a"];
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
if (empty($a)) {
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => 'a',
        'pipeline' => [
            ['$match' => ['a' => ['$type' => 2]]],
            ['$group' => ['_id' => '$a', 'id' => ['$min' => '$_id'], 'b' => ['$addToSet' => '$b'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1, '_id' => -1]],
            ['$limit' => 100]
        ],
        'cursor' => new stdClass,
    ]);
    try {
        echo json_encode($manager->executeCommand('adb', $cmd)->toArray());
    } catch (MongoDB\Driver\Exception $e) {
        echo $e->getMessage(), "\n";
    }
} else {
    $filter = ['a' => $a];
    $options = ['projection' => ['a' => 1, 'b' => 1], 'sort' => ['_id' => -1], 'limit' => 100];
    $query = new MongoDB\Driver\Query($filter, $options);
    echo json_encode($manager->executeQuery('adb.a', $query)->toArray());
}
?>