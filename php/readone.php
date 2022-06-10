<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
include 'config.php';
$my_key="read2.php";

if ($redis->get("isBuckuped")) {
    $result = $redis->get($my_key);
    if (!$result) {
        echo $result;
        exit;
    }
} else {
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => $db_document,
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true], 'a' => ['$ne' => 'test']]],
            ['$group' => ['_id' => '$b', 'a' =>  ['$first' => '$a'], 'id_temp' => ['$first' => '$_id']]],
            ['$sort' => ['id_temp' => -1]],
            ['$project' => ['_id' => 0, 'a' => '$a', 'b' => '$_id']]
        ],
        'cursor' => new stdClass,
    ]);
    try {
        $json = json_encode2($manager->executeCommand($db_name, $cmd)->toArray());
        $result = ($json);
        $redis->set($my_key, $result);
        echo $result;
    } catch (MongoDB\Driver\Exception $e) {
        echo $e->getMessage(), "\n";
        exit;
    }
}
