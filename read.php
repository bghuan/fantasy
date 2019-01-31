<?php
header('Access-Control-Allow-Origin:*');
$a = $_GET["a"];
$_id = $_GET["id"];
$limit = !empty($_GET["limit"]) && preg_match("/^[\d0-9]{1,3}+$/", $_GET["limit"]) ? (int)$_GET["limit"] : 100;
$skip = !empty($_GET["skip"]) && preg_match("/^[\d0-9]{1,9}+$/", $_GET["skip"]) ? (int)$_GET["skip"] : 0;
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
if (strstr($a, '$')) {
    $QueryString = str_replace("$", "_", $_SERVER["QUERY_STRING"]);
    file_get_contents('https://buguoheng.com/create.php?a=dollarlink&b=["' . $QueryString . '"]');
}
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
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => 'a',
        'pipeline' => [
            ['$match' => ['a' => $a]],
            ['$group' => ['_id' => '$b', 'id' => ['$first' => '$_id'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1, 'id' => -1]],
            ['$limit' => $limit],
            ['$skip' => $limit * $skip],
            ['$project' => ['_id' => '$id', 'a' => '$_id', 'count' => '$count']]
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
} else {
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => 'a',
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true]]],
            ['$group' => ['_id' => '$a', 'id' => ['$first' => '$_id'], 'b' => ['$addToSet' => '$b'], 'count' => ['$sum' => 1]]],
            ['$sort' => ['count' => -1, 'id' => -1]],
            ['$limit' => $limit],
            ['$skip' => $limit * $skip],
            ['$project' => ['_id' => '$id', 'a' => '$_id', 'b' => '$b', 'count' => '$count']]
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