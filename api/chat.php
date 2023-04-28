<?php
header('Access-Control-Allow-Origin:*');
include_once('config.php');

$prompt = querystring('prompt');
if (empty($prompt)) {
    echo '?prompt=xxx';
}

$url = "https://api.openai.com/v1/chat/completions";
$api_key = $openaiApiKey;
$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [["role" => "user", "content" => $prompt]],
];

// 发起请求
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key,
]);
$result = curl_exec($ch);
curl_close($ch);

echo $result;
