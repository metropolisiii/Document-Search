<?php 
	header('Content-Type: application/json');
	include("utils.php");
			
	$d = CallAPI("GET", $url);
	if (strpos($d, '401 - Unauthorized') !== FALSE){
		header("HTTP/1.1 401 Unauthorized");
		exit;
	}
	$cat_array = array();
	$categories = explode("\n",$d);
	//Build categories from text file. The textfile has newline delimited entries of the format: main_cat=subcat1;subcat2;subcat3;etc
	for($i=0; $i<count($categories);$i++){
		$main_cat = explode('=',$categories[$i]);
		$the_main_category = $main_cat[0];
		$cat_array[$i]['name']=$the_main_category;
		$cat_array[$i]['value']=str_replace("_"," ",strtoupper($the_main_category));
		$cat_array[$i]['subcats'] = array();
		$subcats = explode(";",$main_cat[1]);
		for ($j=0; $j<count($subcats); $j++){
			$cat_array[$i]['subcats'][$j]['name'] = $subcats[$j];
			$cat_array[$i]['subcats'][$j]['value'] = str_replace("_"," ",strtoupper($subcats[$j]));
		}
	}
	print json_encode($cat_array);