(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function($scope, $http) {
	    	$http.get('/api/poems')
            .success(function(data) {
                $scope.poems = data; //response data
            });	
        
        //function to get random poem
        // this.getPoem = function() {
			// 	var newPoem = {};
			// 	while(!newPoem.complete) {
				// 	newPoem = this.poems[Math.floor(Math.random()*this.poems.length)];
			// 	}
			// 	return newPoem;
		// };
		
		//clicker function to add new poem to index
		// $("#getPoem").on("click", function() {
			// 	var newPoem = this.getPoem();
			// 	this.closest(".row").find(".poem-box").html(newPoem)
			// });
		
    });
//	app.controller('PoemController', function() {
//		this.poems = samplePoems;
//		this.getPoem = function() {
//			var newPoem = {};
//			while(!newPoem.complete) {
//			newPoem = this.poems[Math.floor(Math.random()*this.poems.length)];
//			}
//			return newPoem;
//		};
		// this.getPoems =  function($scope, $http) {
		// 	$http.get('/api/index.html')
  //           .success(function(data) {
  //               $scope.poems = data;
  //               console.log(data);
  //           })
  //           .error(function(data) {
  //               console.log('error: ' + data);
  //           });
  //      };
	//});
//>>>>>>> 80a919ea1a6d5743564fcba9f366e5f536280d79

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



//GET request to display one poem
	//pass poem object to PoemController

//POST new line from addNewLine to poem
	//match ID

//Button listener POST
	//POST newLine
	//GET new poem
