<?php
//https://help.aliyun.com/document_detail/53111.html?spm=a2c4g.11186623.2.13.75594e2fOTsH2M#concept-b43-j4j-zdb
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json; charset=utf-8');

require __DIR__ . '/vendor/autoload.php';
include 'config.php';


use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;

//构建一个阿里云客户端，用于发起请求。
//构建阿里云客户端时需要设置AccessKey ID和AccessKey Secret。
AlibabaCloud::accessKeyClient($accessKeyId2, $accessKeySecret2)
                        ->regionId($regionId)
                        ->asDefaultClient();
//设置参数，发起请求。
try {
    $result = AlibabaCloud::rpc()
                          ->product('Sts')
                          ->scheme('https') // https | http
                          ->version('2015-04-01')
                          ->action('AssumeRole')
                          ->method('POST')
                          ->host('sts.aliyuncs.com')
                          ->options([
                                        'query' => [
                                          'RegionId' => $regionId,
                                          'RoleArn' => $roleArn,
                                          'RoleSessionName' => $roleSessionName,
                                        ],
                                    ])
                          ->request();
    print_r(json_encode($result->toArray()));
} catch (ClientException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
} catch (ServerException $e) {
    echo $e->getErrorMessage() . PHP_EOL;
}