<?php
function get($url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $_id = curl_exec($curl);
    curl_close($curl);
    try {
        return json_decode($_id);
    } catch (Exception $e) {
        return null;
    }
}
$read_url = 'https://buguoheng.com/read.php?a=';
$a = 'attitude';
$records = get($read_url . $a);
foreach ($records as $record) {
    $_id = $record->_id;
    $b = $record->a;
    foreach ($_id as $value) {
        $id = $value;
    }
    echo $id . ' ' . $a . ' ' . json_encode($b).'<br />';
}
?>