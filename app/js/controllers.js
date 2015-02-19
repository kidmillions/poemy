'use strict';

Poemy.controller('ApplicationController', function (
  $rootScope,
  $scope,
  USER_ROLES,
  AuthService,
  AUTH_EVENTS,
  $cookies,
  $location) {

    var loginOnLoad = function (user_info) {
      if (user_info == null) return
      AuthService.autoLogin(user_info).then(function (user) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $scope.setCurrentUser(user);
      }, function (data) {
      });
    }

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isAuthenticated = AuthService.isAuthenticated;
    loginOnLoad(AuthService.userFromCookies());

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
});


Poemy.controller("HomeCtrl", function ($scope, $http, AuthService, Session) {

  $scope.poem = {};
  $scope.started = false;
  $scope.animateCard = '';
  $scope.animateType = '';

  $scope.getStarted = function() {
    $scope.started = true;
  }

  $scope.makeNewPoem = function() {
    //if (!AuthService.isAuthenticated()) return console.log('must be logged in to do this')
    return $http
      .post('/api/new_poem', '')
      .then(function (res) {
        $scope.poem = res.data
      });
  }

  $scope.getRandomPoem = function() {
    $scope.animateCard = "animated bounceOutLeft";
    $scope.animateType = 'animated fadeOutDown';
    $http.get('/api/random_poem')
    .success(function(data, status, headers, config) {
      $scope.poem = data;
      $scope.animateCard = "animated bounceInRight";
      $scope.animateType = 'animated fadeInDown';
    })
    .error(function(data, status, headers, config) {
      alert(data);
    })
  };

  $scope.getRandomPoem();

  //watch text input for data
  $scope.$watch("newLine", function(line) {
    $scope.newLine = line;
  })

  //submit data when ready
  $scope.submit = function(data) {
      $scope.newLine = data
      console.log("button clicked");
      $scope.poem.lines.push(data);
      // animateOut(newPoem);
      postLine();
      $scope.getRandomPoem();
      $scope.newLine = '';
      console.log("completed")
      $scope.getRandomPoem();
  };

  //function that actually makes POST
  var postLine = function() {
    var newLine = {
      poem : $scope.poem._id,
      content : $scope.newLine,
      username : ($scope.currentUser == null ? 'Anonymous' : $scope.currentUser.name),
      title : $scope.poem.title
    }
    console.log(newLine.username);
    $http.post('/api/new_line', newLine)
      .success(function(data, status, headers, config) {
        $scope.success = 'New Line Added. GOOD FOR YOU.';
        console.log("new line submitted");
        noty({text: $scope.success,
            theme: 'relax',
            type: 'success',
            layout: "top",
            animation: {
              open: 'animated bounceIn',
              close: 'animated bounceOut',
              easing:  'swing',
              speed: 500
            },
            timeout: 1500
        });
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
        noty({text: 'Sorry, there was an error: ' + $scope.success,
            theme: 'relax',
            type: 'error',
            layout: "top",
            animation: {
              open: 'animated bounceIn',
              close: 'animated bounceOut',
              easing:  'swing',
              speed: 500
            },
            timeout: 1500
        });
    });
  }
});

Poemy.controller("UsersCtrl", function ($scope, $http) {
  $scope.user = {};
  $http.get('/api/users')
    .success(function(data, status, headers, config) {
      $scope.users = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    });
});

Poemy.controller("PoemsCtrl", function ($scope, $http) {
  $scope.poems = {};
  $http.get('/api/poems')
    .success(function(data, status, headers, config) {
      $scope.poems = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    });
});


Poemy.controller("LoginCtrl", [ '$cookieStore', 'AUTH_EVENTS', '$rootScope' , '$scope', 'AuthService', '$location', function ($cookieStore, AUTH_EVENTS, $rootScope, $scope, AuthService, $location) {

  $scope.success = ''

  $scope.credentials = {
    name: '',
    pass: ''
  }

  $scope.requestLogin = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
      $location.path('/home');
    }, function (data) {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.success = data.statusText;
    });
  }

}]);

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

    $http.post('/api/signup', JSON.stringify(userData))
      .success(function(data, status, headers, config) {
        $scope.success = 'your account was succesfully made!';
        noty({text: $scope.success,
            theme: 'relax',
            type: 'success',
            layout: "top",
            animation: {
              open: 'animated bounceIn',
              close: 'animated bounceOut',
              easing:  'swing',
              speed: 500
            },
            timeout: 1500
        });
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
      });
  };

});

Poemy.controller("NavController", ["$scope", 'AuthService', function($scope, AuthService) {
  $scope.panel = 4;
  $scope.selectPanel = function(selectedPanel) {
      $scope.panel = selectedPanel;
    };
  $scope.isSelected = function(value) {
     return $scope.panel === value;
    };
  $scope.logout = function() {
    AuthService.logout();
    $scope.setCurrentUser(null);
  }
}]);

Poemy.controller("UserCtrl", ["$scope", "Authservice", "Session", function ($scope, AuthService, Session) {
  var user = $scope.currentUser;
  //must filter poems for this user only
  $scope.poems = user.contrbutions;

}]);
