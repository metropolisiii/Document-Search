<?php
	header('Content-Type: application/json');
	include("utils.php");
			
	$d = CallAPI("GET", $url);
	if (strpos($d, '401 - Unauthorized') !== FALSE){
		header("HTTP/1.1 401 Unauthorized");
		exit;
	}
	$doc_array = array();
	$doctypes = explode("\n",$d);
	//Build categories from text file. The textfile has newline delimited entries of the format: main_cat=subcat1;subcat2;subcat3;etc
	for($i=0; $i<count($doctypes);$i++){
		$doc_array[] = $doctypes[$i];
	}
	print json_encode($doc_array);