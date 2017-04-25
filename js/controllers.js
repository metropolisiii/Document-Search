var searchControllers = angular.module('searchControllers',[]);


searchControllers.controller('Navbar',  
    ['$scope', '$http','$stateParams','$window','settings','GetSpecService',function($scope, $http, $stateParams, $window, settings,GetSpecService) {
		$scope.SITE_URL = settings.SITE_URL;
		$scope.docId = $stateParams.specId;
		$scope.specdata = GetSpecService;
		$scope.go_back = function() { 
		   $window.history.back();
		};		
		//Get nav-header menu
		$http.get(settings.SITE_URL+'/wp-json/wp-api-menus/v2/menus/2').
        then(function(response) {
			for (var i=0; i<response.data.items.length; i++){
				response.data.items[i].title = response.data.items[i].title.replace(/&#038;/g,'&');
			}
            $scope.navheader = response.data;
        });
	 }]
);

searchControllers.controller('FooterNav',
	['$scope', '$http', 'settings', function($scope, $http, settings){
		$scope.SITE_URL = settings.SITE_URL;
		$scope.copyright_year = new Date().getFullYear();
		//Get nav-footer menu
		$http.get(settings.SITE_URL+'/wp-json/wp-api-menus/v2/menus/3').
		then(function(response){
			for (var i=0; i<response.data.items.length; i++){
				response.data.items[i].title = response.data.items[i].title.replace(/&#038;/g,'&');
			}
			$scope.navfooter = response.data;
		});
	}]
);
searchControllers.controller('SearchCtrl', ['$rootScope','$scope', '$http', '$location', 'PagerService', '$cookies', 'settings',
	/* Load initial data */
	function ($rootScope,$scope, $http, $location, PagerService, $cookies, settings){
		var resultsPerPage = 10;
		var maxPagesDisplay = 10;
		var numPages=0;
		
		/* Need to convert legacy search query string to current */
		var cat_map = {'security-2':'SECURITY', 'vne':'VIRTUALIZATION AND NETWORK EVOLUTION'}; 
		var subcat_map = {	'broadband-intercept':'BROADBAND INTERCEPT',
							'business-services':'BUSINESS SERVICES', 
							'docsis-3-0':'DOCSIS 3.0', 
							'docsis-3-1':'DOCSIS 3.1', 
							'energy-management-docsis':'ENERGY MANAGEMENT', 
							'dca-mhav2':'MHAV2', 
							'modular-headend-architecture':'MODULAR HEADEND ARCHITECTURE', 
							'network-maintenance':'NETWORK MAINTENANCE', 
							'rmi':'RESOURCE MANAGEMENT INTERFACE', 
							'docsis-1-0':'DOCSIS 1.0', 
							'docsis-1-1':'DOCSIS 1.1',
							'docsis-2-0':'DOCSIS 2.0',
							'dpoe-1-0':'DPOE 1.0',
							'dpoe-2-0':'DPOE 2.0',
							'dpog-1-0':'DPOG 1.0',
							'metadata-1-1': 'VOD METADATA 1.1',
							'metadata-3-0': 'VOD METADATA 3.0',
							'packetcable-1-0': 'PACKETCABLE 1.0',
							'packetcable-1-5': 'PACKETCABLE 1.5',
							'packetcable-2-0': 'PACKETCABLE 2.0',
							'packetcable-3gpp': 'PACKETCABLE 3GPP',
							'packetcable-apps': 'PACKETCABLE APPS',
							'packetcable-business-services': 'PACKETCABLE BUSINESS SERVICES',
							'packetcable-esg': 'PACKETCABLE ESG',
							'packetcable-hd-voice': 'PACKETCABLE HD VOICE',
							'packetcable-ip-interconnect': 'PACKETCABLE IP INTERCONNECT',
							'packetcable-multimedia': 'PACKETCABLE MULTIMEDIA',
							'alternate-content': 'ALTERNATE CONTENT',
							'audience-measurement': 'AUDIENCE MEASUREMENT',
							'cablecard': 'CABLECARD',
							'content-encoding': 'CONTENT ENCODING',
							'enhanced-tv': 'ENHANCED TV (ETV)',
							'hardware': 'HARDWARE',
							'ip-multicast': 'IP MULTICAST',
							'ocap': 'MIDDLEWARE (OCAP)',
							'safi': 'SAFI',
							'security': 'SECURITY',
							'uni-directional': 'UNIDIRECTIONAL',
							'cpe': 'CONSUMER PREMISE EQUIPMENT',
							'sdn': 'SERVICE DELIVERY NETWORK',
							'access-network-independent': 'ACCESS NETWORK INDEPENDENT',
							'energy-management': 'ENERGY MANAGEMENT',
							'online-content-access': 'ONLINE CONTENT ACCESS',
							'web-technology': 'WEB TECHNOLOGY',
							'open-networking': 'OPEN NETWORKING',
							};
		
		$scope.SITE_URL = settings.SITE_URL;
		$rootScope.page = 'Search';
		$scope.sortBy = false;
		$scope.direction = false; //sorting direction
		$scope.pages = new Array(1,2,3,4,5,6,7,8,9,10); //Just assuming that more than 100 results will be returned
		$scope.currentPage = 1;
		$scope.query = '';
		$scope.category = '';
		$scope.subcategory = '';
		$scope.doctype = '';
		$scope.isSearchingContent = {
		   value : 'false'
		};
		$scope.isSearchingArchives = {
			value : 'false'
		};
		$scope.copy_link_button = 'Copy Search Link';
		
		if ($location.search().currentPage)
			$scope.currentPage = parseInt($location.search().currentPage);
		if ($location.search().sortby)
			$scope.sortBy = $location.search().sortby;
		if ($location.search().order)
			$scope.direction = $location.search().order;
		if ($location.search().query)
			$scope.query = $location.search().query;
		if ($location.search().category)
			$scope.category = $location.search().category.toUpperCase();
		if ($location.search().cat){ //legacy search
			if ($location.search().cat in cat_map)
				$scope.category = cat_map[$location.search().cat];
			else
				$scope.category = $location.search().cat.toUpperCase();
			$location.search('cat', null);
		}
		if ($location.search().subcat){
			$scope.subcategory = $location.search().subcat.toUpperCase();
		}
			
		if ($location.search().scat){
			if ($location.search().scat in subcat_map)
				$scope.subcategory = subcat_map[$location.search().scat];
			else
				$scope.subcategory = $location.search().scat.toUpperCase();
			$location.search('scat', null);
		}
		if ($location.search().doctype)
			$scope.doctype = $location.search().doctype;
		$scope.isSearchingContent.value = ($location.search().content == 'true'?'true':'false');
		$scope.isSearchingArchives.value = ($location.search().archives == 'true'?'true':'false');
		
	
		
		function getNumResults(){
			PagerService.getNumPages($scope.query, $scope.category, $scope.subcategory, $scope.doctype, $scope.isSearchingContent.value, $scope.isSearchingArchives.value).then(function(data){
				$scope.numResults = data.numItems;
				$scope.totalPages = Math.ceil(data.numItems/resultsPerPage);
				$('.result_num').show();	
				getPagerControl();
			});
		}
		//Get categories
		$http.get('ajax/categories.php').success(function(data){
			$scope.specsCategories = data;
			$scope.subcategories = getSubcategories($scope.specsCategories, $scope.category);
		});
		
		$scope.search = function(){
			$location.search('query',$scope.query);
			$location.search('category', $scope.category);
			$location.search('subcat', $scope.subcategory);
			$location.search('doctype', $scope.doctype);
			$location.search('content', $scope.isSearchingContent.value);
			$location.search('archives', $scope.isSearchingArchives.value);
			$scope.copy_link_button = 'Copy Search Link';
			$('#spinner').show();
			$('#specresults').fadeTo("slow", .5);
			getNumResults();
			$http.get('ajax/search.php',{params:{'currentPage':$scope.currentPage,'sortby':$scope.sortBy,'order':$scope.direction, 'query':$scope.query, 'category':$scope.category, 'subcategory':$scope.subcategory, 'doctype':$scope.doctype,'content':$scope.isSearchingContent.value, 'archives':$scope.isSearchingArchives.value}}).success(function(data){
				$scope.searchResults = data.results;
				$('#spinner').fadeOut("slow");
				$('#specresults').fadeIn(1000).fadeTo("slow","1");
				$cookies.put('lastSearch', $location.url());
			});
		}
		$scope.changeCategory = function(cat){
			$scope.category = cat;
			$scope.currentPage = 1;
			$location.search('currentPage',1);
			$scope.subcategories = getSubcategories($scope.specsCategories, $scope.category);
			$scope.search();
		}
		$scope.changeSubcategory = function(subcat){
			$scope.subcategry = subcat;
			$scope.currentPage = 1;
			$location.search('currentPage',1);
			$scope.search();
		}
		$scope.changeDoctype = function(doctype){
			$scope.doctype = doctype;
			$scope.currentPage = 1;
			$location.search('currentPage',1);
			$scope.search();
		}
		$scope.changeQuery = function(q){
			$scope.query = q;
			$scope.currentPage = 1;
			$location.search('currentPage', 1);
			$scope.search();
		}
		$scope.searchFileContent = function(q){
			$scope.query = q;
			$scope.currentPage = 1;
			$location.search('currentPage', 1);
			$scope.search();
		}
		$scope.searchArchives = function(q){
			$scope.query = q;
			$scope.currentPage = 1;
			$location.search('currentPage', 1);
			$scope.search();
		}
		$scope.search();
		function getPagerControl(){
			$scope.pages = [];
			var start = Math.max($scope.currentPage-5,1);
			var end = Math.min((start+maxPagesDisplay),$scope.totalPages+1);
			for (var i=start; i<end; i++){
				$scope.pages.push(i);
			}
		}
		function setPage(page){
			$('#spinner').show();
			$scope.currentPage = page;
			$location.search({
				currentPage:$scope.currentPage,
				sortby:$scope.sortBy,
				order:$scope.direction,
				query:$scope.query,
				category:$scope.category,
				subcat:$scope.subcategory,
				doctype:$scope.doctype,
				content:$scope.isSearchingContent.value,
				archives:$scope.isSearchingArchives.value
			});
			$scope.search();
			getPagerControl();
		}
		$scope.orderBy = function($event, sortBy){
			if (!angular.element($event.currentTarget).hasClass('selected')){
				$scope.direction = 'desc';
				angular.element($event.currentTarget).addClass('selected');
			}
			else{
				$scope.direction = 'asc';
				angular.element($event.currentTarget).addClass('selected');
			}
			$scope.sortBy = sortBy;
			setPage($scope.currentPage);
		}
		$scope.setPage = setPage;
		
		$scope.resetFields = function(){
			$scope.currentPage = 1;
			$scope.query = '';
			$scope.category = '';
			$scope.subcategory = '';
			$scope.doctype = '';
			$scope.isSearchingContent = {
			   value : 'false'
			};	
			$scope.isSearchingArchives = {
				value : 'false'
			};
			setPage(1);
		}	
		$scope.copyLink = function(){			
			return $location.absUrl();
		}
	}
]);

searchControllers.controller('DoctypeCtrl', ['$scope', '$http',
	function ($scope,$http){
		$http.get('ajax/doctypes.php').success(function(data){
			$scope.specsDoctypes = data;
		});
	}
]);
searchControllers.controller('AuthCtrl', ['$http', 
	function($http){
		$http.get('/ajax/authenticate.php').success(function(data){
			return data;
		});
	}
]);
searchControllers.controller('SpecController', ['$scope', '$http', '$stateParams', '$rootScope', '$location', '$cookies', 'GetSpecService',
	function($scope, $http, $stateParams, $rootScope, $location, $cookies, GetSpecService){
		$rootScope.page = 'Spec';
		
		$scope.spec = false;
		$scope.version = '';
		if ($location.search().v)
			$scope.version = $location.search().v;
		$scope.lastsearch = $cookies.get('lastSearch');
		$scope.statechange = false;
		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams){
			$scope.statechange = true;			
		});
		$('#spinner').show();
		$scope.docId = $stateParams.specId;
		$scope.getSpec = function(){
			$scope.data = GetSpecService.getSpecData($scope.docId,$location.search().v )
				.then(function(data){
					if (data.data.numItems > 0){
						$scope.spec = data.data.results[0].succinctProperties;
						$('#spec_details').fadeIn(1000);
					}	
					else
						$('#spec_details_not_found').fadeIn(1000);
					$('#spinner').fadeOut("slow");			
				},
				function(data){
					console.log('Spec retrieval failed');					
				});
		}
		$scope.getSpec();
		$scope.getDocVersion = function(version){
			$scope.version = version;
			$location.search('v',version);
			$scope.getSpec();
		}
	}
]);