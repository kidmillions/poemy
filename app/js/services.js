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

Poemy.factory('AuthService', function ($http, Session) {
  var authService = {};

  authService.login = function (credentials) {
    return $http
      .post('/login', JSON.stringiy(credentials))
      .then(function (res) {
        Session.destroy();
        Session.create(
          res.data.id,
          res.data.user.id,
          res.data.user.role);
        return res.data.user;
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



