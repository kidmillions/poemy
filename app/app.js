(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function($scope, $http) {
	    	$http.get('/api/poems')
            .success(function(data) {
                $scope.poems = data; //response data
            });	
        
        	//function to get random poem
        	$scope.getPoem = function() {
				var newPoem = {};
				while(!newPoem.complete) {
			 	newPoem = $scope.poems[Math.floor(Math.random()*($scope.poems.length))];
			 	}
			 	return newPoem;
			 };
			
			//clicker function to add new poem to index
			

			//Determine numLines value based on poem.type
		
    });

	app.controller("LineController", function() {
		
		//mark poem as complete
		function completePoem(poem) {
			if (poem.numLines > poem.lines.length) {
				poem.complete = false;
			} else {
				poem.complete = true;
			}
		};
		this.newLine = "";

		//add new line to poem and find new poem
		this.addNewLine = function(poem) {
			//Needed for this method:
				//Add new line to poem (POST)
				//Get rid of this poem
				//select and pass new (random) poem into controller
			var $btn = $("#getPoem").find("button").button('loading');
			console.log("adding line")
			poem.lines.push(this.newLine);
			this.newLine = "";
			completePoem(poem);
			console.log("finished")
			$btn.button('reset')
		}
	});

	var samplePoems = [{
		title: "Sample Poem",
		numLines: 3,
		type: "Haiku",
		lines: ["this is a first line,", "But the second is best,", "and the third is last."],
		complete: true
	}, {
		title: "Poem 2",
		numLines: 3,
		type: "Haiku",
		lines: ['An old silent pond...', 'A frog jumps into the pond,'],
		complete: false
	}, {
		title: "Poem 3",
		numLines: 3,
		type: "Haiku",
		lines: ["Light of the moon"],
		complete: false
	}, {
		title: "Poem 4",
		numLines: 3,
		type: "Haiku",
		lines: ["A cricket disturbed", "the sleeping child; on the porch", "a man smoked and smiled."],
		complete: true
	}];
})();



//GET request to display one poem
	//pass poem object to PoemController

//POST new line from addNewLine to poem
	//match ID

//Button listener POST
	//POST newLine
	//GET new poem
