"use strict";

Poemy.directive('inputtext', function ($timeout) {
    return {
        restrict:'E',
        replace:true,
        template:'<input type="text"/>',
        scope: {
        	//if there were attributes it would be shown here
        },
        link:function (scope, element, attrs, ctrl) {
        	// DOM manipulation may happen here.
        }
    }
});

Poemy.directive('version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
});

Poemy.directive('getGravatar', function(md5,$timeout) {
  return function(scope, elm, attrs) {
    function checkAndGetGrav () {
        attrs.$observe("email", function(newValue) {
          var email = newValue;
          var tag ='';
          if ((email !== null) && (email !== undefined) && (email !== '')){
            var hash = md5.createHash(email.toLowerCase());
          }
          var src = 'https://secure.gravatar.com/avatar/' + hash + '?s=200&d=mm'
          tag = '<img src=' + src + ' id="gravatar" class="img-responsive"/>'
          elm.find('img#gravatar').replaceWith(tag);
        });
    }
    scope.$on('$viewContentLoaded', checkAndGetGrav());
  }
});

Poemy.directive('uniqueUsername', function($http) {
  return {
    require : 'ngModel',
    link : function(scope, elm, attrs, ctrl) {
      elm.on('change', function (e) {
        var username = elm.val();
        if (( username !== undefined) && ( username!== null) && ( username !== '')) {
        $http.get('/api/username-exists/' + username)
          .success(function(data, status, headers, config) {
            console.log(data);
            ctrl.$setValidity('unique', Boolean(data));
          })
          .error( function(data, status, headers, config) {
            console.log(data);
            ctrl.$setValidiy('unique', Boolean(data));
          });
        }
      });
    }
  }
});
