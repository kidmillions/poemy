'use strict';

Poemy.controller("MyCtrl1", function ($scope, UtilSrvc) {
    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");
});

Poemy.controller("MyCtrl2", function ($scope) {

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

Poemy.controller("SignupCtrl", function ($scope, $http) {

  $scope.postUser = function () {
    alert($scope.user)
    $http.post('/signup', $scope.user)
      .success(function(data, status, headers, config) {
        alert(data);
      })
      .error(function(data, status, headers, config) {
        alert(status);
      });
  };

});

// you may add more controllers below
