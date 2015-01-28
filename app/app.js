(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function() {
		$http.get('/api/index.html')
            .success(function(data) {
                this.poems = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('error: ' + data);
            });
       // this.poems = samplePoems;
	});

	app.controller("LineController", function() {
		this.newLine = "";
		this.addNewLine = function(poem) {
			poem.lines.push(this.newLine);
			this.newLine = "";
		}
	});

})();
