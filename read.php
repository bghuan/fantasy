<?php
header('Access-Control-Allow-Origin:*');
$a = $_GET["a"];
$_id = $_GET["id"];
$limit = !empty($_GET["limit"]) && preg_match("/^[\d0-9]{1,3}+$/", $_GET["limit"]) ? (int)$_GET["limit"] : 100;
$skip = !empty($_GET["skip"]) && preg_match("/^[\d0-9]{1,9}+$/", $_GET["skip"]) ? (int)$_GET["skip"] : 0;
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
if (!empty($_id)) {
    $_ids = explode(',', trim($_id, '[]'));
    $arr = [];
    foreach ($_ids as $_id) {
        if (preg_match("/^[\d0-9a-f]{24}+$/", $_id)) {
            $arr[] = new MongoDB\BSON\ObjectID($_id);
        }
    }
    $filter = ['_id' => ['$in' => $arr]];
    $options = ['sort' => ['_id' => -1]];
    $query = new MongoDB\Driver\Query($filter, $options);
    echo json_encode($manager->executeQuery('adb.a', $query)->toArray());
    exit;
} else if (!empty($a)) {
    $filter = ['a' => $a];
    $options = ['projection' => ['a' => 1, 'b' => 1], 'sort' => ['_id' => -1], 'limit' => $limit, 'skip' => $limit * $skip];
    $query = new MongoDB\Driver\Query($filter, $options);
    echo json_encode($manager->executeQuery('adb.a', $query)->toArray());
    exit;
} else {
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => 'a',
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true]]],
<<<<<<< HEAD
            ['$group' => ['_id' => '$a', 'id' => ['$first' => '$_id'], 'b' => ['$addToSet' => '$b'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1, '_id' => -1]],
=======
            ['$group' => ['_id' => '$a', 'id' => ['$first' => '$_id'], 'a' => ['$first' => '$a'], 'b' => ['$addToSet' => '$b'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1, 'id' => -1]],
>>>>>>> 1a92cd80ecd6bfb8cfa40def91b871c6a26b3d39
            ['$limit' => $limit],
            ['$skip' => $limit * $skip]
        ],
        'cursor' => new stdClass,
    ]);
    try {
        echo json_encode($manager->executeCommand('adb', $cmd)->toArray());
        exit;
    } catch (MongoDB\Driver\Exception $e) {
        echo $e->getMessage(), "\n";
        exit;
    }
}
?>