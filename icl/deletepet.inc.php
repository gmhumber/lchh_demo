<?php

include 'icl/listpets.inc.php';

function deletepet(){
	global $db;
	$petid = intval($_GET['petid']);

	checkgskey("deletepet_$petid");
		
	$query="DELETE FROM pets WHERE id=?";
	sql_prep($query,$db,$petid);
	
	listpets();	
}