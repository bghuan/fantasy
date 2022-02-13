<?php
include 'config.php';

if (!empty($key)) {
    $filter['key'] = $key;
}

$options = ['sort' => ['_id' => -1]];
$query = new MongoDB\Driver\Query($filter, $options);
echo (json_convert($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));