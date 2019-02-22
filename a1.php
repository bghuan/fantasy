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
$_id = get($read_url . $a)[0];
var_dump($_id);
foreach($_id as $key)
{
    echo $key;
}
?>