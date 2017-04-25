<?php
	function CallAPI($method, $url, $data = false, $json = false)
	{
		$curl = curl_init();

		switch ($method)
		{
			case "POST":
				if ($data){
					$data_string = json_encode($data);          
					curl_setopt($curl, CURLOPT_POST, count($data));
					if ($json){
						curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
						curl_setopt($curl, CURLOPT_HTTPHEADER, array(                                                                          
							'Content-Type: application/json',                                                                                
							'Content-Length: ' . strlen($data_string))                                                                       
						);
					}						
					else
						curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
				}
				break;
			case "PUT":
				curl_setopt($curl, CURLOPT_PUT, 1);
				break;
			default:
				if ($data)
					$url = sprintf("%s?%s", $url);
		}
		
		// Optional Authentication:
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		curl_setopt($curl, CURLOPT_USERPWD, "username:password");
		//curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		
		$result = curl_exec($curl);
		curl_close($curl);

		return $result;
	}
	
	
	function getStatus($status){
		//The version is actually the status abbreviation prepended to the version number
		switch($status){
			case "Issued":
				$status_abbr = 'I';
				break;
			case "WorkInProgress":
				$status_abbr = 'W';
				break;
			case "Draft":
				$status_abbr = 'D';
				break;
			case "Closed":
				$status_abbr = 'C';
				break;
			default:
				$status_abbr = '';
		}
		return $status_abbr;
	}
	