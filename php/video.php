<?php

if (is_file(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
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