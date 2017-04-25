$(document).ready(function(){
	$('.hasCustomSelect').change(function(){
		
	});
});

function getSubcategories(j, category){
	for (var i=0; i<j.length; i++){
		if (j[i].value === category)
			return j[i].subcats;
	}
	return false;
}