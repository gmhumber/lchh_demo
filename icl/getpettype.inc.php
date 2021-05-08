<?php

function getpettype($petid=null){
	global $db;
	
	if (!isset($petid)) {
		$petid = intval($_GET['petid']);
	}
		
	$query = "SELECT * FROM pets WHERE id=?;";
	$rs = sql_prep($query,$db,$petid);
	
	$myrow = sql_fetch_assoc($rs);

	$pettype = $myrow['pettype'];

	$output = <<<PETTYPE
		<p style="margin-left:20px;">Pet Type: $pettype</p>
	PETTYPE;

	echo $output;

	
}