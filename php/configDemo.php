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