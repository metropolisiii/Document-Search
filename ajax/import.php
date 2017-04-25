<?php
	include("utils.php");
	$d = CallAPI("GET", $url);
	if (strpos($d, '401 - Unauthorized') !== FALSE){
		header("HTTP/1.1 401 Unauthorized");
		exit;
	}
	/* Connect to database */
	$db_name='specs';	
	$db_user='specsuser';
	//$db_pass = trim(file_get_contents('/etc/forms_app_key.txt'));
	$db_pass = 'spec1325$';
	$db_host='localhost';
	mysql_connect($db_host,$db_user,$db_pass);

	mysql_select_db($db_name) or die( "Unable to select database");
	
	$cat_array = array();
	$categories = explode("\r\n",$d);
	//Build categories from text file. The textfile has newline delimited entries of the format: main_cat=subcat1;subcat2;subcat3;etc
	mysql_query('TRUNCATE TABLE categories');
	mysql_query('TRUNCATE TABLE subcategories');
	mysql_query('TRUNCATE TABLE doctypes');
	
	for($i=0; $i<count($categories);$i++){
		$main_cat = explode('=',$categories[$i]);
		$the_main_category = $main_cat[0];
		mysql_query("INSERT INTO categories (name) VALUES ('{$the_main_category}')");
		$cat_array[$i]['name']=$the_main_category;
		$cat_array[$i]['value']=str_replace("_"," ",strtoupper($the_main_category));
		$cat_array[$i]['subcats'] = array();
		$subcats = explode(";",$main_cat[1]);
		for ($j=0; $j<count($subcats); $j++){
			$cat_array[$i]['subcats'][$j]['name'] = $subcats[$j];
			$cat_array[$i]['subcats'][$j]['value'] = str_replace("_"," ",strtoupper($subcats[$j]));
		}
	}
	print "Complete";