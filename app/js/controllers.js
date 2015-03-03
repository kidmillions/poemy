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
  $scope.started = false;
  $scope.poem = {};
  $scope.brandNewPoem = {}; 
  


   $scope.getPoem = function() {
    Poems.random()
    .success(function(data, status, headers, config) {
      $scope.poem = data;
      $scope.animateCard = "animated bounceInRight";
      $scope.animateType = 'animated fadeInDown';
      $scope.lastLine = data.lines[data.lines.length - 1];
    })
    .error(function(data, status, headers, config) {
      alert(data);
    })
  };

  $scope.getPoem();
  

  $scope.getAnimatedPoem = function() {
    $scope.animateCard = "animated bounceOutLeft";
    $scope.animateType = 'animated fadeOutDown';
    $scope.getPoem();
  };

  //function that actually makes POST
  var postLine = function(newLine) {
    
    var completeStatus = function() {
      if ($scope.poem.lines.length >= ($scope.poem.maxLength - 1)) {
        return true;
      } else {
        return false;
      }
    }

    var newLineContribution = {
      poem : $scope.poem._id,
      content : newLine,
      username : ($scope.currentUser == null ? 'Anonymous' : $scope.currentUser.name),
      title : $scope.poem.title,
      completed: completeStatus()
    }
      Poems.line(newLineContribution)
      .success(function(data, status, headers, config) {
        $scope.success = 'New Line Added. GOOD FOR YOU.';
        Notifications($scope.success, 'success');
        console.log('success');
      })
      .error(function(data, status, headers, config) {
        $scope.success = data;
        Notifications($scope.success, 'error');
    });
  };

  //submit data when ready
  $scope.submit = function(data) {
      console.log(data);
      postLine(data);
      $scope.getAnimatedPoem();
  };

  

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

  var maxLines = function(type) {
    switch (type) {
      case 'haiku':
        return 3;
        break;
      case 'limerick':
        return 5;
        break;
      case 'sonnet':
        return 10;
      break;
      default:
        return 5;
    }
  };

  $scope.submitNewPoem = function() {

    $scope.brandNewPoem = {
          content : [],
          username : ($scope.currentUser == null ? 'Anonymous' : $scope.currentUser.name),
          title : $scope.newTitle,
          completed : false,
          type : $scope.newType,
          maxLines: maxLines($scope.newType)
    };

    var data = $scope.brandNewPoem;

    console.log(data);
    $scope.poem = data;
    console.log("submit button clicked");
    postPoem(data);
    $location.path('#/home');
  };

  var postPoem = function(poem) {
    Poems.newPoem(poem)
    .success(function(data, status, headers, config) {
      $scope.success = 'New Poem Added!';
      console.log("new poem submitted");
      Notifications($scope.success, 'success');
      $scope.newTitle = '';
      $scope.getAnimatedPoem();
      
    })
    .error(function(data, status, headers, config) {
      $scope.success = data;
      Notifications($scope.success, 'error');
    })
    .then(function (res) {
      $scope.poem = res.data;
    });
  };
}]);