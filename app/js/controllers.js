'use strict';

Poemy.controller('ApplicationController', function (
  $rootScope,
  $scope,
  USER_ROLES,
  AuthService,
  AUTH_EVENTS,
  $cookies,
  $location) {

    window.disqus_shortname = 'poemy';

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
    if (AuthService.userFromCookies() != null) {
      loginOnLoad(AuthService.userFromCookies());
    }

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
});


Poemy.controller("HomeCtrl", function (
  $scope,
  $http,
  AuthService,
  Session) {

  $scope.poem = {};
  $scope.started = true;
  $scope.animateCard = '';
  $scope.animateType = '';
  $scope.showNewPoemForm = false;

  $scope.getStarted = function() {
    $scope.started = true;
  }

  $scope.makeNewPoem = function() {
    $scope.showNewPoemForm = true;
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
    $http.post('/api/new_line', newLine)
      .success(function(data, status, headers, config) {
        $scope.success = 'New Line Added. GOOD FOR YOU.';
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

  //left and right key bindings
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          console.log('left');
        break;

        case 39: // right
          console.log('right');
          $scope.getRandomPoem();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
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


Poemy.controller("LoginCtrl", function (
  $cookieStore,
  AUTH_EVENTS,
  $rootScope,
  $scope,
  AuthService,
  $location) {

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

});

Poemy.controller("SignupCtrl", function (
  $rootScope,
  $scope,
  $http,
  $location,
  AUTH_EVENTS,
  AuthService) {

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
    AuthService.signup(userData).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
      $location.path('/home');
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
    }, function (data) {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.success = data;
    });
  };

});

Poemy.controller("NavController", function($scope, AuthService) {
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
});

Poemy.controller("UserCtrl", function (
  $scope,
  $routeParams,
  $http,
  AuthService,
  Session) {

  $scope.username = ($routeParams.name);

  $http.get('/api/user/' + $scope.username)
    .success(function(data, status, headers, config) {
      $scope.user = data;
      if(Session.userID == $scope.user.id) $scope.isSelf = true;
    })
    .error(function(data, status, headers, config) {
    });

});

Poemy.controller("PoemCtrl",function (
  $scope,
  $routeParams,
  $http) {

  var poemID = ($routeParams.id);

  $http.get('api/poem/' + poemID)
    .success(function(data, status, headers, config) {
      $scope.poem = data;
    })
    .error(function(data, status, headers, config) {
    });
});
