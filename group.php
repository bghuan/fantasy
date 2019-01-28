<?php
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$cmd = new MongoDB\Driver\Command(
    [
        'aggregate' => 'a',
        'pipeline' => [
            ['$match' => ['a' => ['$type' => 2]]],
            ['$group' => ['_id' => '$a', 'b' => ['$addToSet' => '$b'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1]],
            ['$limit' => 100],
            ['$skip' => 0]
        ],
        'cursor' => new stdClass,
    ]
);
try {
    $cursor = $manager->executeCommand('adb', $cmd)->toArray();
    echo json_encode($cursor);
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
}
?>