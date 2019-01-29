<?php
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$cmd = new MongoDB\Driver\Command(
    [
        'aggregate' => 'a',
        'pipeline' => [
            [
                '$match' => [
                    'a' => ['$type' => 2]
                ]
            ],
            [
                '$group' => [
                    '_id' => ['a' => '$a'],
                    'b' => ['$addToSet' => '$b'],
                    'count' => ['$sum' => 1]
                ]
            ],
            [
                '$sort' => ['count' => -1]
            ],
            [
                '$limit' => 100
            ],
            [
                '$skip' => 0
            ]
        ],
        'cursor' => new stdClass,
    ]
);
try {
    $cursor = $manager->executeCommand('adb', $cmd)->toArray();

} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
}
$arr = [];
foreach ($cursor as $document) {
    $bson = MongoDB\BSON\fromPHP($document);
    $arr[] = json_decode(MongoDB\BSON\toJSON($bson));
}
echo json_encode($arr);
?>