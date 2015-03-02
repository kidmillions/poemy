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
          var src = 'https://secure.gravatar.com/avatar/' + hash + '?s=200&d=mm';
          var $newElm = $('<img src=' + src + ' id="gravatar" class="img-responsive"/>');
          var oldElm = elm.find('img#gravatar');
          oldElm.replaceWith($newElm);
        });
    }
    scope.$on('$viewContentLoaded', checkAndGetGrav());
  }
});

Poemy.directive('uniqueUsername', ['$http', '$q', function($http, $q) {
  return {
    require : 'ngModel',
    link : function(scope, elm, attrs, ngModel) {
      ngModel.$asyncValidators.usernameAvailable = function(modelValue, viewValue) {
        var value = viewValue || modelValue;
        var defer = $q.defer();
        $http.get('/api/username-exists/' + value)
          .success(function(data) {
            var valid = Boolean(data);
            if (valid == true) {
              defer.reject('exists');
            } else {
              defer.resolve();
            }
          })
          .error(function(data) {
            defer.reject('broke');
          });
        return defer.promise;
      };
    }
  }
}]);

Poemy.directive('uniqueEmail', ['$http', '$q', function($http, $q) {
  return {
    require : 'ngModel',
    link : function(scope, elm, attrs, ngModel) {
      ngModel.$asyncValidators.emailAvailable = function(modelValue, viewValue) {
        var value = viewValue || modelValue;
        var defer = $q.defer();
        $http.get('/api/email-exists/' + value)
          .success(function(data) {
            var valid = Boolean(data);
            if (valid == true) {
              defer.reject('exists');
            } else {
              defer.resolve();
            }
          })
          .error(function(data) {
            defer.reject('broke');
          });
        return defer.promise;
      };
    }
  }
}]);

Poemy.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                var validity = (modelValue == scope.otherModelValue);
                return validity;
            };
            scope.$watch("otherModelValue", function() {
              ngModel.$validate();
            });
        }
    };
});

Poemy.directive('patternValidator', function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$validators.patternCharacters = function(value) {
        var REQUIRED_PATTERNS = [
          /\d+/,    //numeric values
          /[a-z]+/, //lowercase values
          /[A-Z]+/, //uppercase values
          /\W+/,    //special characters
          /^\S+$/   //no whitespace allowed
        ];
        var status = true;
        angular.forEach(REQUIRED_PATTERNS, function (pattern) {
          status = status && pattern.test(value);
        });
        return status;
      }
    }
  }
});


Poemy.directive('lineForm', ['$interval', function($interval) {
  return {
    restrict: "A",
    scope: true,
    link: function($scope) {
      //submits when enter pressed in input
      $('form').find('input').keypress(function(e) {
              // Enter pressed?
              if(e.which == 10 || e.which == 13) {
                  this.form.submit();
              }
      });
      //shows help box
      $('form').find('input').on('focus', function() {
        $('.helpBox').fadeIn();
      });
      $('form').on('submit', function() {
        $('.helpBox').fadeOut();
      })
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
    }
  };
}])

Poemy.directive('openingAnimation', function() {
  return {
    restrict: "A",
    templateUrl: "app/partials/opening-animation.html",
    controller: function($scope) {
      $scope.getStarted = function() {
        $scope.started = true;
      };
    }
  };
})