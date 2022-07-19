<?php 
function load()
{
    include 'api/config.php';
    $limit = 100;
    $skip = 0;
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => $db_document,
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true], 'a' => ['$ne' => 'test'], 'b' => ['$exists' => true, '$nin' =>  [null, '', [], [''], [[]]]]]],
            ['$group' => ['_id' => '$b', 'a' =>  ['$first' => '$a'], 'id_temp' => ['$first' => '$_id']]],
            ['$sort' => ['id_temp' => -1]],
            ['$project' => ['_id' => 0, 'a' => '$a', 'b' => '$_id']],
            ['$limit' => $limit],
            ['$skip' => $skip]
        ],
        'cursor' => new stdClass,
    ]);
    try {
        $jsons = $manager->executeCommand($db_name, $cmd)->toArray();
        echo '<script>let zzz=' . json_encode2($jsons) . '</script>';
    } catch (MongoDB\Driver\Exception $e) {
        echo $e->getMessage(), "\n";
        exit;
    }
}
$html = file_get_contents("index.html");
echo $html;
load();
?>