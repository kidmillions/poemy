(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function($scope, $http) {
	    $http.get('/api/poems')
            .success(function(data) {
                $scope.poems = data; //response data
            });
    });

	app.controller("LineController", function() {
		function completePoem(poem) {
			if (poem.numLines > poem.lines.length) {
				poem.complete = false;
			} else {
				poem.complete = true;
			}
		};
		this.newLine = "";
		this.addNewLine = function(poem) {
			poem.lines.push(this.newLine);
			this.newLine = "";
			completePoem(poem);
		}
	});
})();

