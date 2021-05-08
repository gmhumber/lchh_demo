<?php

include 'icl/listpets.inc.php';

function addpet(){
	global $db;
	
	$petname=$_GET['petname'];
	$pettype=$_GET['pettype'];
	
	$query="INSERT INTO pets (petname, pettype) values (?, ?)";
	sql_prep($query, $db, [$petname, $pettype]);
	
	listpets();	
}