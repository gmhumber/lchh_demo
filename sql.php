<?php
// Gyroscope SQL Wrapper
// MySQLi implementation
// (c) Antradar Software

if (!defined('MYSQLI_STORE_RESULT')) define('MYSQLI_STORE_RESULT',0);
if (!defined('MYSQLI_ASYNC')) define('MYSQLI_ASYNC',8);

$SQL_ENGINE="MySQLi";

function sql_escape($str){
	global $db;
	return mysqli_real_escape_string($db,$str);	
}

function sql_get_db($dbhost,$dbsource,$dbuser,$dbpass,$lazyname=null){
	if (isset($lazyname)){
		global $dbdefers;
		if (!isset($dbdefers)) $dbdefers=array();
		$dbdefers[$lazyname]=array(
			'host'=>$dbhost,'source'=>$dbsource,
			'user'=>$dbuser,'pass'=>$dbpass
		);
		return $lazyname;
	}
	
	$db=mysqli_connect($dbhost,$dbuser,$dbpass,$dbsource);
	return $db;
}

function sql_prep($query,&$db,$params=null){
	global $gsdbprofile;
	
	if (is_string($db)){
		global $dbdefers;
		$dbinfo=$dbdefers[$db];
		$db=sql_get_db($dbinfo['host'],$dbinfo['source'],$dbinfo['user'],$dbinfo['pass']);
	}	
	
	if (!is_array($params)) $params=array($params);
	
	$a=microtime(1);
	
	$typestr=str_pad('',count($params),'s');
	$stmt=mysqli_stmt_init($db);
	mysqli_stmt_prepare($stmt,$query);
		
	if ($stmt->error!=''){
		echo "sql syntax error: ".$query.' '.$stmt->error;
	}
	
		
	///////// [[[ ////////	< PHP 5.6
		
	$cparams=array($stmt,$typestr);
	foreach ($params as $param) array_push($cparams,isset($param)?$param.'':null);
	$func=new ReflectionFunction('mysqli_stmt_bind_param');
	$func->invokeArgs($cparams);
	
	////////// ]]] ///////	>= PHP 5.6
	
	// mysqli_stmt_bind_param($stmt,$typestr,...$params);
	
	///////////////////////
		
	if (!mysqli_stmt_execute($stmt)) echo "sql query error: ".$query.' '.$stmt->error;
	
	$rs=mysqli_stmt_get_result($stmt);
	
	if ($rs==null){
		$rs=array(
			'type'=>'stmt',
			'insert_id'=>$stmt->insert_id,
			'affected_rows'=>$stmt->affected_rows
		);
	}
	
	$b=microtime(1);
			
	if (is_array($gsdbprofile)) array_push($gsdbprofile,array('query'=>$query,'time'=>$b-$a));

	return $rs;
		
}

function sql_query($query,&$db,$mode=MYSQLI_STORE_RESULT){
	global $gsdbprofile;
	
	if (is_string($db)){
		global $dbdefers;
		$dbinfo=$dbdefers[$db];
		$db=sql_get_db($dbinfo['host'],$dbinfo['source'],$dbinfo['user'],$dbinfo['pass']);
	}	
	
	$a=microtime(1);
	$rs=mysqli_query($db,$query,$mode);
	$b=microtime(1);
			
	if ((!$rs)&&$mode==MYSQLI_STORE_RESULT) echo "sql_error: ".$query.' '.mysqli_error();
	if (is_array($gsdbprofile)) array_push($gsdbprofile,array('query'=>$query,'time'=>$b-$a));
	return $rs;
}

function sql_copy_from_query($query,$db,$omits,$table){
	$rs=sql_query($query,$db);
	$myrow=sql_fetch_assoc($rs);
	$fields=array();
	$values=array();
	$params=array();
	foreach ($myrow as $k=>$v){
		if (in_array(strtolower($k),$omits)) continue;
		array_push($fields,$k);
		array_push($values,'?');
		array_push($params,$v);
	}
	
	$query="insert into $table (".implode(',',$fields).") values (".implode(',',$values).")";
	$rs=sql_prep($query,$db,$params);
	$id=sql_insert_id($db,$rs);
	return $id;
}

function sql_fetch_array($rs){
	return mysqli_fetch_array($rs);

}

function sql_fetch_assoc($rs){
	return mysqli_fetch_assoc($rs);
}

function sql_insert_id($db,$rs=null){

	if (is_array($rs)&&$rs['type']=='stmt'&&isset($rs['insert_id'])) return $rs['insert_id'];
	if (!isset($rs)) return mysqli_insert_id();
	return mysqli_insert_id($db);
}

function sql_affected_rows($db,$rs){
	if (is_array($rs)&&$rs['type']=='stmt'&&isset($rs['affected_rows'])) return $rs['affected_rows'];
	if (is_object($rs)&&isset($rs->num_rows)) return $rs->num_rows;	
	return mysqli_affected_rows($db);
}

function sql_begin_transaction($db){
	$query="begin";
	mysqli_query($query,$db);	
	
}

function sql_commit($db){
	$query="commit";
	mysqli_query($query,$db);	
}

function sql_rollback(){
	$query="rollback";
	mysqli_query($query,$db);	
}

/* Sample Connection

$db=sql_get_db("localhost","mnhydra","root","mnstudio");
*/
