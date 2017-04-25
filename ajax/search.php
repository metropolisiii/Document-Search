<?php 
	header('Content-Type: application/json');
	include("utils.php");
	
	if (!isset($_GET['currentPage']))
		$currentPage = 1;
	else
		$currentPage = $_GET['currentPage'];
	$sortby = (isset($_GET['sortby']) && $_GET['sortby'] != 'false' ? $_GET['sortby']:false);
	$order = (isset($_GET['order']) && $_GET['order'] !='false' ? $_GET['order']:'DESC');
	$query = (isset($_GET['query'])?$_GET['query']:'');
	$category = (isset($_GET['category'])?$_GET['category']:'');
	$subcategory = (isset($_GET['subcategory'])?$_GET['subcategory']:'');
	preg_match('/([0-9]+\.[0-9]+)/',$subcategory, $matches);
	if (is_numeric($matches[1]))
		$subcategory = $matches[1];
	$doctype = (isset($_GET['doctype'])?$_GET['doctype']:'');
	$content = (isset($_GET['content'])?$_GET['content']:'false');
	$archives = (isset($_GET['archives'])?$_GET['archives']:'false');
	
	switch($sortby){
		case 'title':
			$sortby = 'D.cm:description';
			break;
		case 'date':
			$sortby = 'D.cl:publishDate';
			break;
		case 'name':
			$sortby = 'D.cmis:name';
			break;
		case 'doctype':
			$sortby = 'D.cl:documentType';
			break;
		case 'supportdocs':
			$sortby = 'D.cl:hasSupportDocs';
			break;
		case 'ecns':
			$sortby = 'D.cl:hasRelatedECNs';
			break;
		case 'version':
			$sortby = 'D.cl:documentVersion';
			break;
	}
	
	$skipcount = ($currentPage - 1) * 10;
	//Get first 10 documents that are in the public_website folder, ordered by publish date descending that are not of type engineeringchange
	$query = "SELECT D.cmis:description, D.cmis:name, D.cl:techPubDocumentStatus, D.cl:documentId, D.cl:documentVersion, D.cl:publishDate, D.cl:isCurrentVersion, D.cl:slug, D.cl:documentType, D.cl:hasSupportDocs, D.cl:hasRelatedECNs, D.cmis:objectId, T.cm:title,D.cl:category, D.cl:subCategory FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE D.cmis:objectTypeId ='D:cl:techPubDocument' AND D.cl:techPubDocumentStatus <> 'Confidential'  AND CONTAINS(D, 'PATH:\"//app:company_home/st:sites/cm:tech-pubs/cm:documentLibrary/cm:public_website//*\"')  AND D.cl:isCurrentVersion ".($archives=='true'?"<>":"=")." TRUE ".($query != ''?"AND (CONTAINS(D,'cmis:description:\'*".$query."*\'') OR CONTAINS(T,'cm:title:\'*".$query."*\'')".(($content == 'true' && $query != '')?" OR CONTAINS(D,'".$query."~0.5')":"").")":"").($category != ''?" AND (CONTAINS(D,'cl:category:\'".$category."\''))":"").($subcategory != ''?" AND (CONTAINS(D,'cl:subCategory:\'".$subcategory."\''))":"").($doctype != ''?" AND (CONTAINS(D,'cl:documentType:\'".$doctype."\''))":"")." ORDER BY ".($sortby?$sortby:"D.cl:publishDate")." ".($order?$order:"DESC");
	$data = array("maxItems" => "10", "skipCount" => $skipcount, "succinct"=>"true", "cmisaction" => "query", "statement" => $query );
	$d = CallAPI("POST", $url, $data);
	$d = json_decode($d);
	for ($i=0; $i<count($d->results); $i++){
		$objectId = explode(";", $d->results[$i]->succinctProperties->{'D.cmis:objectId'});
		$d->results[$i]->succinctProperties->{'D.cmis:objectId'} = $objectId[0];
		$documentStatus = '';
		if ($d->results[$i]->succinctProperties->{'D.cl:techPubDocumentStatus'} != "" && strpos($d->results[$i]->succinctProperties->{'D.cl:documentVersion'},".") === FALSE)
			$documentStatus = getStatus($d->results[$i]->succinctProperties->{'D.cl:techPubDocumentStatus'});
		$d->results[$i]->succinctProperties->{'version'} = $documentStatus.$d->results[$i]->succinctProperties->{'D.cl:documentVersion'};

		//If the slug is blank, use the document ID instead
		if ($d->results[$i]->succinctProperties->{'D.cl:slug'} == '')
			$d->results[$i]->succinctProperties->{'D.cl:slug'} = $d->results[$i]->succinctProperties->{'D.cl:documentId'};
	}
	
	$d = json_encode($d);
	if (strpos($d, '401 - Unauthorized') !== FALSE){
		header("HTTP/1.1 401 Unauthorized");
		exit;
	}
	print $d;
