'use strict';

var Poemy = angular.module('Poemy', []);

Poemy.config(function($routeProvider) {
    $routeProvider.when(
    	'/login',
    	{
    		templateUrl: 'app/partials/login.html',
    		controller: 'LoginCtrl'
    	}
    );
    $routeProvider.when(
    	'/signup',
    	{
    		templateUrl: 'app/partials/signup.html',
    		controller: 'SignupCtrl'
    	}
    );
    $routeProvider.when(
      '/users',
      {
        templateUrl: 'app/partials/users.html',
        controller: 'UsersCtrl'
      }
    );
    $routeProvider.when(
      '/',
      {
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl'
      }
    );
    $routeProvider.otherwise(
        {
            redirectTo: '/'
        });
});
