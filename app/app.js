(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function($scope, $http) {
	    $http.get('/api/poems')
            .success(function(data) {
                $scope.poems = data; //response data
            });
    });

	app.controller("LineController", function() {
		this.newLine = "";
		this.addNewLine = function(poem) {
			poem.lines.push(this.newLine);
			this.newLine = "";
		}
	});

})();
