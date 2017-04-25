<?php 
	include("utils.php");
	$data = array("username" => "username", "password" => "password");
	$d = CallAPI("POST", $url, $data, true);
	$d = json_decode($d, true);
	print_r($d['data']['ticket']);
