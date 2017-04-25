<?php 
	header('Content-Type: application/json');
	include("utils.php");
	if (!isset($_GET['id']))
		exit;
	$status_abbr = "";
	$query = "SELECT * FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE  (D.cl:slug ='".$_GET['id']."' OR D.cl:documentId = '".$_GET['id']."') AND D.cl:techPubDocumentStatus <> 'Confidential' AND CONTAINS(D, 'PATH:\"//app:company_home/st:sites/cm:tech-pubs/cm:documentLibrary/cm:public_website//*\"')";
	if (isset($_GET['version'])){ //If we're looking at a specific version
		//Get the most recent version. If the version being looked for is one more than that version, then we know it's closed, so get the closed version. Otherwise, it's an issued version.
		$version_query = "SELECT D.cl:documentVersion FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE  D.cl:slug ='".$_GET['id']."' AND D.cl:techPubDocumentStatus <> 'Confidential' AND CONTAINS(D, 'PATH:\"//app:company_home/st:sites/cm:tech-pubs/cm:documentLibrary/cm:public_website//*\"') ORDER BY D.cl:documentVersion DESC";
		$data = array("succinct"=>"true", "cmisaction" => "query", "statement" => $version_query );
		$d = CallAPI("POST", $url, $data);
		$d = json_decode($d);
		if (intval($_GET['version']) == intval($d->results[0]->succinctProperties->{'D.cl:documentVersion'}[0])+1) //This is a closed version
			$query.=" AND D.cl:documentVersion='01' AND D.cl:techPubDocumentStatus='Closed'";
		else
			$query.=" AND D.cl:documentVersion='{$_GET['version']}' AND D.cl:techPubDocumentStatus<>'Closed'";	
	}
	else
		$query.=" AND D.cl:isCurrentVersion = TRUE";
	
	$data = array("succinct"=>"true", "cmisaction" => "query", "statement" => $query );
	$d = CallAPI("POST", $url, $data);
	$d = json_decode($d);
	if (count($d->results) == 0){
		$d = json_encode($d);
		print $d;
		exit;
	}
	
	if (strpos($d->results[0]->succinctProperties->{'D.cl:documentVersion'},".") === FALSE){
		$status = $d->results[0]->succinctProperties->{'D.cl:techPubDocumentStatus'};
		$status_abbr = getStatus($status);
		$d->results[0]->succinctProperties->{'D.cl:documentVersion'} = $status_abbr.$d->results[0]->succinctProperties->{'D.cl:documentVersion'};
	}
		
	//Remove the semicolon from the objectId
	$objectid = explode(";", $d->results[0]->succinctProperties->{'D.cmis:objectId'});
	$d->results[0]->succinctProperties->{'D.cmis:objectId'} = $objectid[0];
	
	//Get versions. 	
	$query = "SELECT * FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE D.cl:documentId='".$d->results[0]->succinctProperties->{'D.cl:documentId'}."' AND CONTAINS(D, 'PATH:\"//app:company_home/st:sites/cm:tech-pubs/cm:documentLibrary/cm:public_website//*\"') ORDER BY D.cl:publishDate DESC";
	$data = array("succinct"=>"true", "cmisaction" => "query", "statement" => $query );
	$v = CallAPI("POST", $url, $data);
	$v = json_decode($v);	
	
	$d->results[0]->succinctProperties->versions = array();
	$closed_document_index = 0;
	$latest_version = 0;
	$closed_document = false;
	
	for ($i=0; $i<count($v->results); $i++){
		$status_abbr = "";
		if (strpos($v->results[$i]->succinctProperties->{'D.cl:documentVersion'},".") === FALSE)
			$status_abbr = getStatus($v->results[$i]->succinctProperties->{'D.cl:techPubDocumentStatus'});
		if ($status_abbr == 'C'){
			$closed_document_index = $i;
			$closed_document = true;
		}
		$objectId = explode(";", $d->results[0]->succinctProperties->{'D.cmis:objectId'});
		if (!isset($d->results[0]->succinctProperties->versions[$i]))
			$d->results[0]->succinctProperties->versions[$i] = new stdClass();
		$d->results[0]->succinctProperties->versions[$i]->objectId = $objectId[0];
		$d->results[0]->succinctProperties->versions[$i]->slug = $v->results[$i]->succinctProperties->{'D.cl:slug'};
		$d->results[0]->succinctProperties->versions[$i]->fullversion = $status_abbr.$v->results[$i]->succinctProperties->{'D.cl:documentVersion'};
		$d->results[0]->succinctProperties->versions[$i]->title =$v->results[$i]->succinctProperties->{'T.cm:title'};
		$d->results[0]->succinctProperties->versions[$i]->number = $v->results[$i]->succinctProperties->{'D.cl:documentVersion'};
		$d->results[0]->succinctProperties->versions[$i]->date = $v->results[$i]->succinctProperties->{'D.cl:publishDate'};
		if ($v->results[$i]->succinctProperties->{'D.cl:publishDate'} != "")
			$d->results[0]->succinctProperties->versions[$i]->date = $v->results[$i]->succinctProperties->{'D.cl:publishDate'};
		$d->results[0]->succinctProperties->versions[$i]->objectId = $v->results[$i]->succinctProperties->{'D.cmis:objectId'};
		if ($v->results[$i]->succinctProperties->{'D.cl:hasSupportDocs'} == 1 || (isset($v->results[$i]->succinctProperties->{'D.cl.hasRelatedECNs'}) && $v->results[$i]->succinctProperties->{'D.cl.hasRelatedECNs'} == 1))
			$d->results[0]->succinctProperties->versions[$i]->hasAttachments = 'Yes';
		else
			$d->results[0]->succinctProperties->versions[$i]->hasAttachments = 'No';
		$d->results[0]->succinctProperties->versions[$i]->file = $v->results[$i]->succinctProperties->{'D.cmis:contentStreamFileName'};
		if ($v->results[$i]->succinctProperties->{'D.cl:documentVersion'} > $latest_version)
			$latest_version = $v->results[$i]->succinctProperties->{'D.cl:documentVersion'};
	}
	
	if ($closed_document){
		$leading_zero = false;
		if ($latest_version[0] == '0'){
			$leading_zero = true;
			$latest_version = ltrim($latest_version,"0");
		}
		$latest_version = intval($latest_version)+1;
		if ($leading_zero)
			$latest_version = "0".$latest_version;
		$d->results[0]->succinctProperties->versions[$closed_document_index]->number = $latest_version;
	}
	
	//Get ECNs
	if ($d->results[0]->succinctProperties->{'D.cl:hasRelatedECNs'} || $d->results[0]->succinctProperties->{'D.cl:hasSupportDocs'}){
		$d->results[0]->succinctProperties->ecns = array();
		$docs = CallAPI("GET", $url.$d->results[0]->succinctProperties->{'D.cmis:objectId'});
		$docs = json_decode($docs);
		if ($d->results[0]->succinctProperties->{'D.cl:hasRelatedECNs'}){
			$j=0;
			for ($i=0; $i<count($docs->children); $i++){
				if (strpos($docs->children[$i]->type->{'prefixedName'}, "engineeringChangeRequest") !== FALSE){
					$noderef = explode("/",$docs->children[$i]->nodeRef);
					$noderef = $noderef[count($noderef)-1];
					$query = "SELECT D.cmis:objectId, T.cm:title,D.cl:publishDate, D.cmis:contentStreamFileName FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE D.cmis:objectId='".$noderef."'";
					$data = array("succinct"=>"true", "cmisaction" => "query", "statement" => $query );
					$ecn = CallAPI("POST", $url, $data);
					$ecn = json_decode($ecn);
									
					$d->results[0]->succinctProperties->ecns[$j] = new stdClass();
					$d->results[0]->succinctProperties->ecns[$j]->name = $ecn->results[0]->succinctProperties->{'T.cm:title'};
					$d->results[0]->succinctProperties->ecns[$j]->date = $ecn->results[0]->succinctProperties->{'D.cl:publishDate'};
					$d->results[0]->succinctProperties->ecns[$j]->file = $ecn->results[0]->succinctProperties->{'D.cmis:contentStreamFileName'};
					$d->results[0]->succinctProperties->ecns[$j]->objectId = $ecn->results[0]->succinctProperties->{'D.cmis:objectId'};
					$j++;
				}
				
			}
		}
		if ($d->results[0]->succinctProperties->{'D.cl:hasSupportDocs'}){
			$j=0;
			for ($i=0; $i<count($docs->assocs); $i++){
				if (strpos($docs->assocs[$i]->assocType->name, "supportDocs") !== FALSE){
					$noderef = explode("/",$docs->assocs[$i]->targetRef);
					$noderef = $noderef[count($noderef)-1];
					$query = "SELECT D.cmis:objectId, T.cm:title, D.cl:publishDate, D.cmis:contentStreamFileName FROM cl:techPubDocument D INNER JOIN cm:titled T ON T.cmis:objectId = D.cmis:objectId WHERE D.cmis:objectId='".$noderef."'";
					$data = array("succinct"=>"true", "cmisaction" => "query", "statement" => $query );
					$supportdoc = CallAPI("POST", $url, $data);
					$supportdoc = json_decode($supportdoc);
					$d->results[0]->succinctProperties->supportDocs[$j] = new stdClass();
					$d->results[0]->succinctProperties->supportDocs[$j]->name = $supportdoc->results[0]->succinctProperties->{'T.cm:title'};
					$d->results[0]->succinctProperties->supportDocs[$j]->date = $supportdoc->results[0]->succinctProperties->{'D.cl:publishDate'};
					$d->results[0]->succinctProperties->supportDocs[$j]->file = $supportdoc->results[0]->succinctProperties->{'D.cmis:contentStreamFileName'};
					$d->results[0]->succinctProperties->supportDocs[$j]->objectId = $supportdoc->results[0]->succinctProperties->{'D.cmis:objectId'};
					$j++;
				}				
			}
		}		
	}
	
		
	$d = json_encode($d);
	print $d;
