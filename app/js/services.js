"use strict";

/*
 * Services can be defined as : "value", "service", "factory", "provider", or "constant".
 *
 * For simplicity only example of "value" and "service" are shown here.
 */

// EXAMPLE OF CORRECT DECLARATION OF SERVICE AS A VALUE
Poemy.value('version', '0.1');

// EXAMPLE OF CORRECT DECLARATION OF SERVICE
// here is a declaration of simple utility function to know if an given param is a String.
Poemy.service("UtilSrvc", function () {
    return {
        isAString: function(o) {
            return typeof o == "string" || (typeof o == "object" && o.constructor === String);
        },
        helloWorld : function(name) {
        	var result = "Hum, Hello you, but your name is too weird...";
        	if (this.isAString(name)) {
        		result = "Hello, " + name;
        	}
        	return result;
        }
    }
});

Poemy.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

Poemy.constant('USER_ROLES', {
  all: 'all',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
});

Poemy.factory('AuthService', function ($http, $cookies, Session) {
  var authService = {};

  authService.login = function (credentials, $cookies) {
    return $http
      .post('/api/login', JSON.stringify(credentials))
      .then(function (res) {
        var user = res.data;
        console.log(user);
        Session.destroy();
        Session.create(
          'u',
          user._id,
          user.role);
        return user;
      });
  };

  //authService.makeGuest = function () {
  //  Session.create(null, 'g', 'guest');
  //  return {
  //    role : 'guest',
  //    name : 'guest',
  //    email : 'none'
  //  }
  //}

  authService.isAuthenticated = function () {
    return !!Session.userId;
  }

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    var roleMatch = false;
    if (Session.userRole === authorizedRoles[0] || authorizedRoles[0] == 'all') {
        roleMatch = true;
      }
    var authenticated = (roleMatch)
    //console.log('authenticated: ' + authenticated)
    return authenticated;
  };

  return authService;
});

Poemy.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  }
  return this;
});

Poemy.factory('AuthInterceptor', function ($rootScope,
  $q,
  AUTH_EVENTS) {

    return {
      responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            404: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
      }
    };
});


Poemy.factory('PoemRetrieval', function($scope, $http) {
  $http.get('/api/poems')
    .success(function(data, status, headers, config) {
      $scope.poems = data;
    })
    .error(function(data, status, headers, config) {
      alert(data);
    });
    
    return $scope.poems
})