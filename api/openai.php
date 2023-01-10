<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';

// 引入 OSS SDK
use OSS\OssClient;
use OSS\Core\OssException;

$prompt = querystring('prompt');
$hash = querystring('hash');

if (empty($prompt)) {
    exit;
}

$fileName = '../static/image/openai/' . $hash . '.jpg';
if (!file_exists($fileName) || true) {

    $apiKey = $openaiApiKey;
    $url = 'https://api.openai.com/v1/images/generations';
    $data = [
        'prompt' => $prompt,
        // 'size' => '256x256',
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
    // $response = '{ "created": 1673325055, "data": [ { "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-K2ND9d35VSLmOCCzGwHO0MdH/user-iOpm7F4HIMSZ28rhWAWcsdyS/img-BKZ0vylsIeST6f7nXSZI9kmP.png?st=2023-01-10T03%3A30%3A55Z&se=2023-01-10T05%3A30%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-01-10T03%3A01%3A35Z&ske=2023-01-11T03%3A01%3A35Z&sks=b&skv=2021-08-06&sig=/KQIyVLXI5oJed8WQqR7Fr0GRtjl8m01qhBupZ470T0%3D" } ] }';

    try {
        $jsonString = $response;
        $jsonObject = json_decode($jsonString);
        $data = $jsonObject->data;
        $url = $data[0]->url;
        $imageData = file_get_contents($url);
        file_put_contents($fileName, $imageData);
        // echo $fileName;

        $objectName = $hash . '.png';
        echo ($response);

        try {
            $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint2);
            $ossClient->uploadFile($bucket2, $objectName, '/www/wwwroot/fantasy/static/image/openai/' . $hash . '.jpg');
            exit;
        } catch (OssException $e) {
            printf(__FUNCTION__ . ": FAILED\n");
            printf($e->getMessage() . "\n");
            return;
        }
    } catch (e) {
        var_dump($response);
    }
}