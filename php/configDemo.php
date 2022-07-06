<?php
//mongodb
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$db_name = "";
$db_document = "";

//oss
$accessKeyId = "";
$accessKeySecret = "";
$endpoint = "";
$bucket = "";
$object = "";
$objectDir = "";
$filePath = "";

//sts
$accessKeyId2 = "";
$accessKeySecret2 = "";
$regionId = "";
$roleArn = "";
$roleSessionName = "";

//redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

//email
$emailUserName = "";
$emailAccount = "";
$emailPassword = "";

// common function
function decodeUnicode($str)
{
    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', function ($matches) {
        return iconv("UCS-2BE", "UTF-8", pack("H*", $matches[1]));
    }, $str);
}

function json_encode2($str)
{
    return decodeUnicode(json_encode($str));
}

function querystring($str, $dafault = '')
{
    if (isset($_POST[$str])) return $_POST[$str];
    else if (isset($_GET[$str])) return $_GET[$str];
    else return $dafault;
}
