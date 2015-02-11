'use strict';

var Poemy = angular.module('Poemy', ['ngRoute','ngMd5','ngMessages', 'ngAnimate']);

Poemy.config(['$routeProvider', 'USER_ROLES', function($routeProvider, USER_ROLES) {
    $routeProvider.when(
    	'/login',
    	{
    		templateUrl: 'app/partials/login.html',
    		controller: 'LoginCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
    	}
    );
    $routeProvider.when(
    	'/signup',
    	{
    		templateUrl: 'app/partials/signup.html',
    		controller: 'SignupCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
    	}
    );
    $routeProvider.when(
      '/users',
      {
        templateUrl: 'app/partials/users.html',
        controller: 'UsersCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin]
        }
      }
    );
    $routeProvider.when(
      '/',
      {
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl',
        data: {
          authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
        }
      }
    );
    $routeProvider.otherwise(
        {
            redirectTo: '/'
        });
}]);

Poemy.run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$routeChangeStart', function (next, current) {
    console.log(current.authorizedRoles);
    var authorizedRoles = next.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          //user is not allowed, but logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          //user is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated)
        }
      }
  });
});

Poemy.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})
