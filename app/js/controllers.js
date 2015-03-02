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


Poemy.controller("HomeCtrl", ['$scope', 'AuthService', 'Session', 'Poems', 'Notifications', function (
  $scope,
  AuthService,
  Session, Poems, Notifications) {
  $scope.started = true;
  $scope.poem = {};
  $scope.brandNewPoem = {};
  
  //set max lines for poem (logic should probably be put elsewhere)
  // switch($scope.poem.type) {
  //     case 'haiku':
  //       $scope.poem.maxLines = 3;
  //       break;
  //     case 'limerick':
  //       $scope.poem.maxLines = 5;
  //       break;
  //     case 'sonnet':
  //       $scope.poem.maxLines = 10;
  //     break;
  //     default:
  //       $scope.poem.maxLines = 5;
  //   }
  // }

  $scope.getRandomPoem = function() {
    $scope.animateCard = "animated bounceOutLeft";
    $scope.animateType = 'animated fadeOutDown';
    Poems.random()
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

  //submit data when ready
  $scope.submit = function(data) {
      console.log(data);
      // $scope.newLine = data;
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
      Poems.line(newLine)
      .success(function(data, status, headers, config) {
        $scope.success = 'New Line Added. GOOD FOR YOU.';
        Notifications($scope.success, 'success');
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
        Notifications($scope.success, 'error');
    });
  }

}]);

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

Poemy.controller("PoemsCtrl", ["$scope", "Poems", function ($scope, Poems) {
  $scope.poems = {};
    Poems.all()
    .success(function(data, status, headers, config) {
      $scope.poems = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    });
}]);


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

Poemy.controller("SignupCtrl", ["$rootScope", "$scope", "$http", "$location", "AUTH_EVENTS", "AuthService", "Notifications", function (
  $rootScope,
  $scope,
  $http,
  $location,
  AUTH_EVENTS,
  AuthService,
  Notifications) {

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
      Notifications("There were errors", "error");
    }
  }

  var postUser = function (userData) {
    AuthService.signup(userData).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
      $location.path('/home');
    }, function (data) {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.success = data;
      Notifications($scope.success, "success");
    });
  };

}]);

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

Poemy.controller("PoemCtrl", ['$scope', "$routeParams", 'Poems', function (
  $scope,
  $routeParams, 
  Poems) {

  var poemID = ($routeParams.id);

  Poems.one(poemID)
    .success(function(data, status, headers, config) {
      $scope.poem = data;
    })
    .error(function(data, status, headers, config) {
    });
}]);


Poemy.controller("NewPoemCtrl", ["$scope", "$controller", '$http', '$location', 'Poems', 'Notifications', function($scope, $controller, $http, $location, Poems, Notifications) {
  $controller('HomeCtrl', {$scope: $scope});

  $scope.newTitle;
  $scope.newType;
  $scope.started = false;

  $scope.$watch("newTitle", function(title) {
      if (title === '') return
      console.log("changing to: " + title);
      $scope.newTitle = title;

  });


  var types = ["haiku", "limerick", "sonnet"];

  $scope.$watch("newType", function(type) {
    if (type === '') return
    console.log("changing to: " + type);
      $scope.newType = type;
  });

  $scope.submitNewPoem = function() {

    $scope.brandNewPoem = {
          content : [],
          username : ($scope.currentUser == null ? 'Anonymous' : $scope.currentUser.name),
          title : $scope.newTitle,
          completed : false,
          type : $scope.newType
    };

    var data = $scope.brandNewPoem;

    console.log(data);
    $scope.poem = data;
    console.log("submit button clicked");
    postPoem(data);
  };

  var postPoem = function(poem) {
    Poems.newPoem(poem)
    .success(function(data, status, headers, config) {
      $scope.success = 'New Poem Added!';
      console.log("new poem submitted");
      Notifications($scope.success, 'success');
      $scope.newTitle = '';
      $scope.getRandomPoem();
      $location.path('#/home');
    })
    .error(function(data, status, headers, config) {
      $scope.success = data;
      Notifications($scope.success, 'error');
    })
    .then(function (res) {
      $scope.poem = res.data
    });
  };
}]);