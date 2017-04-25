<?php 
	header('Content-Type: application/json');
	include("utils.php");
	$query = (isset($_GET['query'])?$_GET['query']:'');
	$category = (isset($_GET['category'])?$_GET['category']:'');
	$subcategory = (isset($_GET['subcategory'])?$_GET['subcategory']:'');
	preg_match('/([0-9]+\.[0-9]+)/',$subcategory, $matches);
	if (is_numeric($matches[1]))
		$subcategory = $matches[1];
	$doctype = (isset($_GET['doctype'])?$_GET['doctype']:'');
	$content = (isset($_GET['content'])?$_GET['content']:'false');
	$archives = (isset($_GET['archives'])?$_GET['archives']:'false');
	//Get the number of records available
	$query = "SELECT D.cmis:description, D.cmis:creationDate, D.cmis:name, D.cl:documentType, D.cl:hasSupportDocs, D.cl:hasRelatedECNs, D.cmis:objectId FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE  D.cmis:objectTypeId ='D:cl:techPubDocument' AND D.cl:techPubDocumentStatus <> 'Confidential'  AND CONTAINS(D, 'PATH:\"//app:company_home/st:sites/cm:tech-pubs/cm:documentLibrary/cm:public_website//*\"')  AND D.cl:isCurrentVersion".($archives=='true'?"<>":"=")."TRUE ".($query != ''?"AND (CONTAINS(D,'cmis:description:\'*".$query."*\'') OR CONTAINS(T,'cm:title:\'*".$query."*\'')".(($content == 'true' && $query != '')?" OR CONTAINS(D,'".$query."~0.5')":"").")":"").($category != ''?" AND (CONTAINS(D,'cl:category:\'".$category."\''))":"").($subcategory != ''?" AND (CONTAINS(D,'cl:subCategory:\'".$subcategory."\''))":"").($doctype != ''?" AND (CONTAINS(D,'cl:documentType:\'".$doctype."\''))":"");
	$data = array("succinct"=>"true",  "cmisaction" => "query", "statement" => $query);
	$d = json_decode(CallAPI("POST", $url, $data));
	$numitems = new \stdClass;
	$numitems->numItems = $d->numItems;
	$d = json_encode($numitems);
	print $d;