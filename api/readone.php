<?php
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');
include 'config.php';

$random=rand(0,1000);
// echo $random;

$cmd2 = new MongoDB\Driver\Command([
    'aggregate' => $db_document,
    'pipeline' => [
        ['$match' => ['a' => ['$exists' => true], 'a' => ['$ne' => 'test'], 'b' => ['$exists' => true, '$nin' =>  [null, '', [], [''], [[]]]]]],
        ['$group' => ['_id' => '$b', 'a' =>  ['$first' => '$a'], 'id_temp' => ['$first' => '$_id']]],
        ['$sort' => ['id_temp' => -1]],
        ['$project' => ['_id' => 0, 'a' => '$a', 'b' => '$_id']],
        ['$skip'=> $random],
        ['$limit' => 1]
    ],
    'cursor' => new stdClass,
]);

try {
    // print_r ($manager->executeCommand($db_name, $cmd2)->toArray());
    // echo decodeUnicode(json_encode($manager->executeCommand($db_name, $cmd2)->toArray()));
//   var_dump($manager->executeCommand($db_name, $cmd2)->toArray());
   
    $jsons = $manager->executeCommand($db_name, $cmd2)->toArray();
    foreach (($jsons) as $index => $item) {
        $key = ($item->a);
        if (is_array($item->b))
            $value = implode(',', $item->b);
        else
            $value = ($item->b);
        echo $value.' - '.$key;
    }
    exit;
} catch (MongoDB\Driver\Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
}
    