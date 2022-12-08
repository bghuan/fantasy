<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

$a = querystring('a');
if (empty($a)) {
    exit;
}
$fileName = '../static/image/openai/' . $a . '.jpg';
if (file_exists($fileName)) {
    echo $fileName;
    exit;
}

$apiKey = $openaiApiKey;
$url = 'https://api.openai.com/v1/images/generations';
$data = [
    'model' => 'image-alpha-001',
    'prompt' => $a,
    'size' => '256x256',
];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

try {
    $jsonString = $response;
    $jsonObject = json_decode($jsonString);
    $data = $jsonObject->data;
    $url = $data[0]->url;
    $imageData = file_get_contents($url);
    file_put_contents($fileName, $imageData);
    echo $fileName;
} catch (e) {
    var_dump($response);
}