'use strict';

Poemy.controller('ApplicationController', function (
  $rootScope,
  $scope,
  USER_ROLES,
  AuthService,
  AUTH_EVENTS) {

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };

    //make guest session if no session
    //if(AuthService.isAuthenticated() === false) {
    //  var guest = AuthService.makeGuest();
    //  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    //  $scope.setCurrentUser(guest);
    //}

});

Poemy.controller("MyCtrl1", function ($scope, UtilSrvc) {
    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");
});

Poemy.controller("HomeCtrl", function ($scope, $http) {

  var getNewPoems = function() {
    $http.get('/api/random_poem')
    .success(function(data, status, headers, config) {
       $scope.poem = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    })
  };

  getNewPoems();

  //watch text input for data
  $scope.$watch("newLine", function(line) {
    $scope.newLine = line;
  })

  //submit data when ready
  $scope.submit = function(data) {
      console.log("button clicked");
      $scope.poem.lines.push(data);
      var newPoem = $scope.poem;
      // animateOut(newPoem);
      postLine(newPoem);
      $scope.newLine = '';
      getNewPoems();
    };

  //function that actually makes POST
  var postLine = function(poem) {
    $http.post('/api/random_poem', poem)
      .success(function(data, status, headers, config) {
        $scope.success = 'New Line Added. GOOD FOR YOU.';
        console.log("new line submitted");
        noty({text: $scope.success,
            animation: {
              open: 'animated bounceInLeft',
              close: 'animated bounceOutLeft',
              easing:  'swing',
              speed: 500
            }
        });
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
    });
  }

  //instigating animations and notifications
  // $scope.leavingPoem = null;
  // $scope.enteringPoem = null;

  // $scope.animateOut = function(poem) {
  //   return $scope.leavingPoem = poem;
  // };

  // $scope.animateIn = function(poem) {
  //   return $scope.enteringPoem = poem;
  // }

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

Poemy.controller("LoginCtrl", function (AUTH_EVENTS, $rootScope, $scope, AuthService) {

  $scope.credentials = {
    name: '',
    pass: ''
  }

  $scope.requestLogin = function (credentials) {
    console.log(credentials);
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  }

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

Poemy.controller("NavController", ["$scope", function($scope) {
  $scope.panel = 4;
  $scope.selectPanel = function(selectedPanel) {
      $scope.panel = selectedPanel;
    };
  $scope.isSelected = function(value) {
     return $scope.panel === value;
    };

}]);

// you may add more controllers below
