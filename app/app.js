(function() {
	var Poemy = angular.module('Poemy', [
        "Poemy.controllers",
        "Poemy.services",
        "Poemy.directives",
        "Poemy.filters",
        "ngRoute",
        "ngResource"
    ]);

    App.config(function ($routeProvider) {
        $routeProvider
            .when('/view1', {
                templateUrl: 'view/view1.html'
            })
            .when('/view2', {
                templateUrl: 'view/view2.html'
            })
            .otherwise({redirectTo : 'view1'});
    });
}());
