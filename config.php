<?php
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");

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