searchApp.directive('backButton', function(){
    return {
      restrict: 'A',
		
      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
});

searchApp.directive('ngEnter', function () {
	return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
    			scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});