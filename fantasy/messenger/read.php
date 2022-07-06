<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

$a =  querystring('a');;

if (empty($a)) {
    exit;
}

$filter = ['a' => ['$eq' => $a]];
$options = ['sort' => ['_id' => -1]];
$query = new MongoDB\Driver\Query($filter, $options);
echo (json_encode2($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));
