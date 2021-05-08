<?php
include 'preheader.php';
include 'icl/listpets.inc.php';
?>

<html>
<head>
	<title>LCHH Pets Demo</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta id="viewport" name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; user-scalable=0;"/>
</head>
<body>
HEADER
<hr>


<div id="petslist">
	<?= listpets() ?>
</div>

<hr>
FOOTER

<script src="nano.js"></script>
<script src="index.js"></script>

</body>
</html>