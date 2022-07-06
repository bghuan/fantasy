<?php

//https://github.com/aliyun/aliyun-oss-php-sdk/releases/download/v2.5.0/aliyun-oss-php-sdk-2.5.0.phar
require_once 'aliyun-oss-php-sdk-2.5.0.phar';
require_once 'aliysun-oss-php-sdk-2.5.0.phar/../autoload.php';
include 'config.php';


use OSS\OssClient;
use OSS\Core\OssException;

$endpoint = "http://oss-cn-hangzhou.aliyuncs.com";
$ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
$bucket="bgh-open";

$options = array (
     'delimiter' => $delimiter ,
     'prefix' => '' ,
     'max-keys' => 150 ,
//   'marker' => $nextMarker,
);
try {
     $listObjectInfo = $ossClient ->listObjects( $bucket , $options );
} catch (OssException $e ) {
     printf ( __FUNCTION__ . ": FAILED \n " );
     printf ( $e ->getMessage() . " \n " );
     return ;
}
$listObject = $listObjectInfo ->getObjectList();

// print_r($listObjectInfo);
 foreach($listObject as $object) {  
        $a[]=($object->getkey()); 
    }  
    echo(json_encode($a));