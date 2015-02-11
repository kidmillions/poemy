'use strict';

Poemy.controller('ApplicationController', function (
  $scope,
  USER_ROLES,
  AuthService) {
    
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };

});

Poemy.controller("MyCtrl1", function ($scope, UtilSrvc) {
    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");
});

Poemy.controller("HomeCtrl", function ($scope, $http) {

  $http.get('/api/random_poem')
    .success(function(data, status, headers, config) {
       $scope.poem = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    })
});

Poemy.controller("UsersCtrl", function ($scope, $http) {
  $http.get('/api/users')
    .success(function(data, status, headers, config) {
      $scope.users = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    });
});

Poemy.controller("LoginCtrl", function ($scope, $http) {
  $scope.credentials = {
    username: '',
    password: ''
  }
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }, function () {
      $rootScope.$broatcast(AUTH_EVENTS.loginFailed);
    });
  };
});

Poemy.controller("SignupCtrl", function ($scope, $http) {
  $scope.success = '';

  $scope.submit = function(formData, validity) {
    console.log('clicked submit');
    if(validity) {
      var user = {
        name : $scope.user.name,
        email : $scope.user.email,
        pass : $scope.user.pass
      }
      postUser(user);
    } else {
      alert('There were errors');
    }
  }

  var postUser = function (userData) {

    $http.post('/signup', JSON.stringify(userData))
      .success(function(data, status, headers, config) {
        $scope.success = 'your account was succesfully made!';
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
      });
  };

});

// you may add more controllers below
