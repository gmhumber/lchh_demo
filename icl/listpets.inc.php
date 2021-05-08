<?php

function listpets(){
	global $db;
	
	$query="SELECT * FROM pets ORDER BY petname, pettype;";
	$rs=sql_query($query,$db);

	$output = "";
    //Read the data from the result set and format it for output
	while ($myrow=sql_fetch_assoc($rs)){
		$petid=$myrow['id'];
		$petname=htmlentities($myrow['petname']);
		//$pettype=htmlentities($myrow['pettype']);
	
        $gskey = emitgskey("deletepet_$petid");

        $output .= <<<ROWDATA
            <div>
                <a href=# onclick="getpettype(event, $petid)">Pet Name: $petname</a>
                <a href=# onclick="deletepet(event, $petid, '$gskey')" style="color:red;">[Delete Pet]</a> 
            </div>
            <div id="pettypediv_$petid">
            </div>
        ROWDATA;
    }

    //Add a form for creating new pets to the HTML code for output
    $output .= <<<FORM
        <form onsubmit="addpet(event);" style="margin:20px 0 10px 0;">
            <h2 style="margin:0;">Add a New Pet</h2>
            <input id="petname" placeholder="enter pet name">
            <input id="pettype" placeholder="enter pet type">
            <input type="submit" value="Add Pet">
        </form>
    FORM;

    echo $output;

	
}

?>
