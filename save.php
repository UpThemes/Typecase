<?php

$fontData = json_encode($_POST["json"]);

$myFile = "fonts.json";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $fontData);
fclose($fh);

?>