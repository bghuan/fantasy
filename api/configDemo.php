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


function write_index()
{
    global $db_document;
    global $manager;
    global $db_name;
    $list = '';
    $cmd = new MongoDB\Driver\Command([
        'aggregate' => $db_document,
        'pipeline' => [
            ['$match' => ['a' => ['$exists' => true], 'a' => ['$ne' => 'test'], 'b' => ['$exists' => true, '$nin' =>  [null, '', [], [''], [[]]]]]],
            ['$group' => ['_id' => '$b', 'a' =>  ['$last' => '$a'], 'id_temp' => ['$last' => '$_id']]],
            ['$sort' => ['id_temp' => -1]],
            ['$project' => ['_id' => 0, 'a' => '$a', 'b' => '$_id']]
        ],
        'cursor' => new stdClass,
    ]);
    $jsons = $manager->executeCommand($db_name, $cmd)->toArray();
    foreach (($jsons) as $index => $item) {
        $key = ($item->a);
        if (is_array($item->b))
            $value = implode(',', $item->b);
        else
            $value = ($item->b);
        $list = $list . "<div><a>$value</a> - <a>$key</a></div>";
    }

    $f = fopen("../index.html", "w");
    $text = file_get_contents('../index.html.template');
    $find_place = "<div class='card-body' id='fantasy_content'>";
    $text = str_replace($find_place, $find_place . $list, $text);
    fwrite($f, $text);
    fclose($f);
}
