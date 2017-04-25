/* 
	Create environment
	Authenticate to alfresco to get a token
	Load categories from Mongodb
	Load subcategories from categories
	Load document types
	Load initial specs (top 10)
	Go to individual spec
	Go to individual spec not newest version
	Download a spec
	Load next page
	Filter by keyword
	Filter by category
	Filter by subcategory
	Filter by doc type
	Search file content
	Reset the form
	Search with query string in address bar
	View individual
	View individual with multiple versions
	View individual with related ecns
	View individual with support docs
	Copy search link
	Searh archives
	Create category import script

*/

/*
$(document).ready(function(){
	var ticket = '';
	$.get('/ajax/authenticate.php', function(data){
		ticket = data;
		getCategories();
	});	
	
	var getCategories = function(){
		$.getJSON('/ajax/categories.php', {'ticket':ticket}, function(data){
			
		});
	};
	
});
*/