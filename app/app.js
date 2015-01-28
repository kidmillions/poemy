(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function() {
		this.getPoems =  function($scope, $http) {
			$http.get('/api/index.html')
            .success(function(data) {
                $scope.poems = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('error: ' + data);
            });
        };
	});

	app.controller("LineController", function() {
		this.newLine = "";
		this.addNewLine = function(poem) {
			poem.lines.push(this.newLine);
			this.newLine = "";
		}
	});

})();
