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

function saveFileWithBackup($fileName, $imageContent, $backupDir) {
    // 1. 检查备份目录是否存在，不存在则创建（并设置权限）
    if (!is_dir($backupDir)) {
        // mkdir第三个参数true表示递归创建多级目录，0755为目录权限（根据需求调整）
        if (!mkdir($backupDir, 0755, true)) {
            error_log("备份目录创建失败：{$backupDir}");
            return false;
        }
    }

    // 2. 判断目标文件是否已存在
    if (file_exists($fileName)) {
        // 2.1 解析原文件信息：目录、文件名、后缀
        $fileDir = dirname($fileName);          // 原文件所在目录（如：./images）
        $baseName = basename($fileName);        // 原文件名（含后缀，如：photo.jpg）
        $extension = pathinfo($fileName, PATHINFO_EXTENSION); // 文件后缀（如：jpg）
        $fileNameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME); // 无后缀文件名（如：photo）

        // 2.2 生成时间戳（格式：年月日时分秒，如：20240520143025）
        $timeSuffix = date('YmdHis');

        // 2.3 生成备份文件名：原文件名_时间戳.后缀（如：photo_20240520143025.jpg）
        $backupFileName = "{$fileNameWithoutExt}_{$timeSuffix}.{$extension}";
        // 生成备份文件完整路径（备份目录 + 备份文件名）
        $backupFilePath = rtrim($backupDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $backupFileName;

        // 2.4 移动旧文件到备份目录（rename支持跨目录移动，需确保权限）
        if (!rename($fileName, $backupFilePath)) {
            error_log("旧文件移动失败：原路径{$fileName} → 备份路径{$backupFilePath}");
            return false;
        }
        error_log("旧文件已备份：{$backupFilePath}");
    }

    // 3. 写入新文件（file_put_contents返回字节数，false表示失败）
    $writeResult = file_put_contents($fileName, $imageContent);
    if ($writeResult === false) {
        error_log("新文件写入失败：{$fileName}");
        return false;
    }

    error_log("新文件写入成功：{$fileName}（大小：{$writeResult}字节）");
    return true;
}