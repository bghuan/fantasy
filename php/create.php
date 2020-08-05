<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

function FormitDollor($str)
{
    if (is_array($str)) {
        $str = implode(' ',$str);
    }
    if (is_object($str)) {
        $str = '\''.$str.'\'';
    }
    $i = 0; 
    while (strpos($str, '\$')) {
        $str = str_replace('\$', '$', $str);
        if ($i > 100) {
            return '';
            exit;
        }
        $i++;
    }
    return str_replace('$', '\$', $str);
    exit;
} 

$a = FormitDollor($_GET["a"]);
$b = FormitDollor($_GET["b"]);
// if (empty($b)) {
//     $b = [];
// } else {
//     $b = json_decode($b);
// }
if (empty($a)) {
    exit;
}
$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    '_id' => new MongoDB\BSON\ObjectID,
    'a' => $a,
    'b' => $b
];
$_id = $bulk->insert($document);
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
if ($result) {
    echo $document["_id"];
    $redis->set("isBuckuped", false);
}

$cmd = new MongoDB\Driver\Command([
        'aggregate' => $db_document,
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true], 'b' => ['$exists' => true, '$nin' =>  ['', [], [''], [[]]]]]],
            ['$group'=>['_id'=>'$b', 'a' =>  ['$first' => '$a'], 'id_temp' => ['$first' => '$_id']]],
            ['$sort' => ['id_temp' => -1]],
            ['$project' => ['_id' => '$id_temp', 'a' => '$a', 'b' => '$_id']]
        ],
        'cursor' => new stdClass,
    ]);
    try {
        $json=json_encode($manager->executeCommand($db_name, $cmd)->toArray());
    } catch (MongoDB\Driver\Exception $e) {
        echo $e->getMessage(), "\n";
    }
  
// require_once __DIR__ . '/vendor/autoload.php';
// use OSS\OssClient;
// use OSS\Core\OssException;  

// $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
$objectName = $objectDir . $db_name . '.' . $db_document.'.read' . '.json';
// $ossClient->putObject($bucket, $objectName, $json,$metadata);
 
function curlput($url,$data,$method='PUT',$bucket,$object,$accesskey ,$accesskeySecret){
 $time = gmdate ("D, d M Y H:i:s T");
    $str = "PUT\n\n"."application/json\n".$time."\n/".$bucket."/".$object;
    // echo($str);
    $signature = base64_encode(hash_hmac("sha1", $str, $accesskeySecret, true));
    // echo($time);
    // echo($signature);
    $ch = curl_init(); //初始化CURL句柄 
    curl_setopt($ch, CURLOPT_URL, $url); //设置请求的URL
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method); //设置请求方式 
    
    $headers = array(
    "Date:".$time,
    'Content-Type:application/json',
    'Cache-Control:no-cache',
    "Authorization:OSS ".$accesskey.":".$signature
    );
    curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);//设置HTTP头信息
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);//设置提交的字符串
    $document = curl_exec($ch);//执行预定义的CURL 
    if(!curl_errno($ch)){ 
      $info = curl_getinfo($ch); 
    //   echo 'Took ' . $info['total_time'] . ' seconds to send a request to ' . $info['url']; 
    } else { 
      echo 'Curl error: ' . curl_error($ch); 
    }
    curl_close($ch);
     
    return $document;
}
$bucket = 'bghuan';
$object = $objectName;
$url = 'http://bghuan.oss-cn-shenzhen-internal.aliyuncs.com/'.$object;
$data = $json;
$return = curlput($url, $data, 'PUT',$bucket,$object,$accessKeyId,$accessKeySecret);
 
// var_dump($return);