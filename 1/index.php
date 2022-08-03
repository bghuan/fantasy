<!DOCTYPE html>
<html lang='zn'>

<head>
    <meta charset='UTF-8' name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <link rel='stylesheet' href='index.css'>
    <title>fantasy-bgh</title>
</head>

<body>
    <header>
        <span>fantasy</span>
    </header>
    <main>
        <input id='content' type='text'>
        <button id='get'>query</button>
        <button id='send'>send</button>
        <br>
        <?php
        $s = file_get_contents('https://buguoheng.com/api/save?namespace=buguoheng&width&height');
        $q = json_decode($s, true);
        echo "<textarea name='' id='aaa' rows='8' cols='40' onresize='aaaaa()' style='width:{$q['width']};height:{$q['height']}'></textarea>";
        ?>
        <!--<textarea name='' id='aaa' rows='8' cols='40' onresize='aaaaa()' style='width:100px'></textarea>-->
        <div id='inputs'></div>
        <button id='add'>+</button>
        <button id='inputs_send'>inputs_send</button>
        <button id='inputs_get'>inputs_get</button>
    </main>
    <footer>
    </footer>

    <script src='index.js?7'></script>
</body>

</html>