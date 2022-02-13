<?php
include 'config.php';

$arr = [];
$filter = [];
if (!empty($id)) {
    $_ids = explode(',', trim($id, '[]'));
    foreach ($_ids as $_id)
        $arr[] = new MongoDB\BSON\ObjectID($_id);
    $filter['_id'] = ['$in' => $arr];
}
if (!empty($key)) {
    $filter['key'] = $key;
}

$options = ['sort' => ['date' => -1]];
$query = new MongoDB\Driver\Query($filter, $options);
echo (json_convert($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));
