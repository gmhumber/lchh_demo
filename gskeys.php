<?php

/*
This is a simplified implementation of the GSKey utilities
*/


$gsreqkey='a3e0RjN0:nsczwR';

function makegskey($verb){
	global $gsreqkey;
	global $_SERVER;
	
		
	$key=md5($gsreqkey.'_'.$verb.'_'.$_SERVER['REMOTE_ADDR']);	
	return $key;
}

function emitgskey($verb,$groupnames=''){
	//echo makegskey($verb,$groupnames);
	return makegskey($verb,$groupnames);	
}

function checkgskey($verb){
	global $gsreqkey;
	global $_SERVER;
	
	//simply "return" here to enable debugging
		
	$key=$_POST['X-GSREQ-KEY'];
			
	$key_=md5($gsreqkey.'_'.$verb.'_'.$_SERVER['REMOTE_ADDR']);
	if ($key!==$key_) apperror('gskey: request denied');
	
}

function apperror($str){header('apperror: '.rawurlencode($str));die('apperror - '.$str);}
