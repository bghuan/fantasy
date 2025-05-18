<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

require_once 'aliyun-oss-php-sdk-2.5.0.phar';

// 引入 OSS SDK
use OSS\OssClient;
use OSS\Core\OssException;

$prompt = querystring('prompt');
$hash = querystring('hash');

$fileName = '../static/image/ali/' . $hash . '.png';
$apiKey = $imagealiApiKey; 
$model = 'wanx2.1-t2i-turbo'; // 模型名称
$size = '1024*1024'; // 图像尺寸
$n = 1; // 生成数量
$taskId = ''; // 任务 ID（初始化）
$maxRetries = 20; // 最大轮询次数
$retryInterval = 3; // 轮询间隔（秒）

$apiEndpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
$requestData = [
    'model' => $model,
    'input' => [
        'prompt' => $prompt
    ],
    'parameters' => [
        'size' => $size,
        'n' => $n
    ]
];

// 初始化 cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-DashScope-Async: enable',
    "Authorization: Bearer {$apiKey}",
    'Content-Type: application/json',
]);

// 执行请求
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    die('Curl 错误: ' . curl_error($ch));
}
curl_close($ch);

// 解析任务提交响应
if ($httpCode !== 200) {
    die("任务提交失败，状态码: {$httpCode}\n响应内容: {$response}");
}

$responseData = json_decode($response, true);
$taskId = $responseData['output']['task_id'];
echo "任务已提交，ID: {$taskId}\n";

for ($i = 1; $i < $maxRetries + 1; $i++) {
    echo '第'.$i.'次查询';
    $apiUrl = "https://dashscope.aliyuncs.com/api/v1/tasks/{$taskId}";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer {$apiKey}",
        'Content-Type: application/json',
    ]);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo('任务查询失败: ' . curl_error($ch));
    }
    curl_close($ch);

    $responseData = json_decode($response, true);
    if (!$responseData) {
        echo('响应解析失败');
    }
    $taskStatus = $responseData['output']['task_status'];
    echo "处理任务状态".$taskStatus;
    switch ($taskStatus) {
        case 'SUCCEEDED':
            $imageUrl = $responseData['output']['results'][0]['url'];
            echo "任务成功！图像 URL: {$imageUrl}\n";

            $imageContent = file_get_contents($imageUrl);
            if ($imageContent) {
                file_put_contents($fileName, $imageContent);
                echo "图像已保存至: {$fileName}\n";

                 $objectName = $hash . '.png';

                try {
                    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint2);
                    $ossClient->uploadFile($bucket2, $objectName, '/www/wwwroot/fantasy/static/image/ali/' . $hash . '.png');
                    exit;
                } catch (OssException $e) {
                    printf(__FUNCTION__ . ": FAILED\n");
                    printf($e->getMessage() . "\n");
                    return;
                }
                }
            break;
        
        case 'FAILED':
            echo("任务失败，错误信息: {$responseData['output']['error_message']}");
        
        default:
            echo "任务处理中，当前状态: {$responseData['output']['task_status']}\n";
            echo "请稍后重试查询\n";
                echo "第 {$i} 次查询，状态: {$taskStatus}，等待 {$retryInterval} 秒重试...\n";
                sleep($retryInterval); // 等待后重试
                break;
    }
}
?>