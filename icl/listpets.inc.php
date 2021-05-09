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
	
        // The output from emitgskey() is echoed directly to screen which is not the desired behaviour for this code. Therefore, ob_start() and ob_get_clean() is used to capture the echoed output in a buffer and then assign it to a variable for further processing.
        ob_start();
        emitgskey("deletepet_$petid");
        $gskey = ob_get_clean();

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
