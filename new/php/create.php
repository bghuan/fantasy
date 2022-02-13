<?php
include 'config.php';

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
$result = (($manager->executeQuery($db_name . '.' . $db_document, $query)->toArray()));
if (count($result) > 0) {
    foreach ($result[0]->_id as $id) {
        echo ($id);
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->update(
            ['_id' => new MongoDB\BSON\ObjectID($id)],
            ['$set' => ['date' => date("Y-m-d H:i:s")]]
        );
        $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
        $result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
        exit;
    }
}

$bulk = new MongoDB\Driver\BulkWrite;
$_id = $bulk->insert($document);
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
echo $_id;
