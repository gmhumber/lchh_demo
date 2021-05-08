<?php

include 'preheader.php';

$cmd=$_GET['cmd'];

switch ($cmd){
	case 'addpet': include 'icl/addpet.inc.php'; addpet(); break;
	case 'deletepet': include 'icl/deletepet.inc.php'; deletepet(); break;
	case 'getpettype': include 'icl/getpettype.inc.php'; getpettype(); break;

}