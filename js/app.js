'use strict';

var searchApp = angular.module('searchApp', [
	'ui.router',
	'searchControllers',
	'ngCookies',
	'ngclipboard'
]);
searchApp.constant("settings",{
	"SITE_URL":'https://www.url.com/',
});
searchApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider){
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/specification/');
		$stateProvider.
			state('home',{
				url: '/',
				templateUrl: 'pages/search.html'
			}).
			state('spec',{
				url:'/:specId',
				templateUrl: 'pages/spec.html'
			}).
			state('spec_trail',{
				url:'/:specId/',
				templateUrl: 'pages/spec.html'
			})
	}
]);
searchApp.filter('startFrom', function(){
	return function(input, start){
		start = +start;
		return input.slice(start);
	}
});

