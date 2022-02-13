<?php
include 'config.php';

if (!empty($id)) {
    $_ids = explode(',', trim($id, '[]'));
    foreach ($_ids as $_id)
        $arr[] = new MongoDB\BSON\ObjectID($_id);
    $filter['_id'] = ['$in' => $arr];
}
foreach ($document as $key => $value) {
    if ($key != 'id' && $key != 'date') {
        if (!empty($value))
            $filter[$key] = $value;
        else
            $filter[$key] = ['$exists' => true];
    }
}

$options = ['sort' => ['date' => -1]];
$query = new MongoDB\Driver\Query($filter ?? [], $options);
echo (json_convert($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));
