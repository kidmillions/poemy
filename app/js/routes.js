'use strict';

var Poemy = angular.module('Poemy', ['ngRoute','ngMd5','ngMessages', 'ngAnimate', 'ngCookies', 'ngDisqus']);

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
          authorizedRoles: [USER_ROLES.all]
        }
      }
    );
    $routeProvider.when(
      '/poems',
      {
        templateUrl: 'app/partials/poems.html',
        controller: 'PoemsCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      }
    );
    $routeProvider.when(
      '/home',
      {
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      }
    );

    $routeProvider.when(
      '/user/:name',
      {
        templateUrl: 'app/partials/user.html',
        controller: 'UserCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      }
    );

    $routeProvider.when(
      '/poem/:id',
      {
        templateUrl: 'app/partials/poem.html',
        controller: 'PoemCtrl',
        data: {
          authorizedRoles: [USER_ROLES.all]
        }
      }
    );

    $routeProvider.otherwise(
        {
            redirectTo: '/home'
        });
}]);

Poemy.run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    try {
      var authorizedRoles = next.data.authorizedRoles;
    } catch(e) {
      console.log('poo');
    }
      if (!AuthService.isAuthorized(authorizedRoles)) {
        console.log('wont let you in');
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
