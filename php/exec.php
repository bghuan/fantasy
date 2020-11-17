<?php
    $shell = "
cd /www/wwwroot/fantasy;
git fetch --all;
git reset --hard origin/main;";
    exec($shell, $result, $status);
    $shell = "<font color='red'>$shell</font>";
    echo "<pre>";
    if( $status ){
        echo "shell命令{$shell}执行失败";
    } else {
        echo "shell命令{$shell}成功执行, 结果如下<hr>";
        print_r( $result );
    }
    echo "</pre>";
?>