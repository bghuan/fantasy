<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';

// 引入 OSS SDK
use OSS\OssClient;
use OSS\Core\OssException;

$a = querystring('a');
if (empty($a)) {
    exit;
}

$fileName = '../static/image/openai/' . $a . '.jpg';
if (!file_exists($fileName)) {

    $apiKey = $openaiApiKey;
    $url = 'https://api.openai.com/v1/images/generations';
    $data = [
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
        // echo $fileName;

        $objectName = 'image/openai/' . $a . '.jpg';

        try {
            $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
            $ossClient->uploadFile($bucket, $objectName, '/www/wwwroot/fantasy/static/image/openai/' . $a . '.jpg');
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