searchApp.service('PagerService',function($http, $q){
    return{
		getNumPages: function(query, category, subcategory, doctype, content, archives){
			var defer = $q.defer();
			$http.get('ajax/numResults.php', {cache:'true',params:{'query':query, 'category':category, 'subcategory':subcategory, 'doctype':doctype,'content':content,'archives':archives}}).success(function(data){
				defer.resolve(data);
			});
			return defer.promise;
		}
	}
});

searchApp.factory('GetSpecService', ['$http', '$q', 
	function GetSpecService($http, $q){
		this.shared = null;
		
		var service = {
			specInfo: [],
			getSpecData: getSpecData			
		};
		
		return service;
		
		
		function getSpecData(id, version){
			var def = $q.defer();			
			$http.get('ajax/getSpec.php',{params:{'id':id,'version':version}})
				.success(function(data){
						data['current_page'] = window.location.href;
						service.specInfo = data;
						def.resolve(data);
				})
				.error(function(){
					def.reject("Failed to get Spec Info");
				});
				
			return $http({
				method:"GET",
				url:'ajax/getSpec.php',
				params:{'id':id,'version':version}
			});
		};
	}
]);
