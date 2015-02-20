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

Poemy.directive('newPoemForm', ["$http", function($http) {
  return {
    restrict: "A",
    require: '^ngModel',
    templateUrl: "app/partials/new-poem.html",
    controller: function($scope) {
      var types = ["haiku", "limerick", "sonnet"];
      $scope.$watch("newTitle", function(title) {
          $scope.title = title;
      });
      $scope.$watch("type", function(type) {
          $scope.type = type;
      });


      $scope.postPoem = function() {
        var brandNewPoem = {
          poem: $scope.poem._id,
          content : [],
          username : ($scope.currentUser == null ? 'Anonymous' : $scope.currentUser.name),
          title : $scope.title,
          completed: false,
        };

        $http.post('/api/new_poem', brandNewPoem)
        .success(function(data, status, headers, config) {
          $scope.success = 'New Poem Added!';
          console.log("new poem submitted");
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
          })
        })
        .then(function (res) {
          $scope.poem = res.data
        });

        //redirect route to home.html, somehow

      };
    },
    alias: "newPoem"
  };
}]);
