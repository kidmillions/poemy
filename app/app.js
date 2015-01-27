(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function() {
		this.poem = samplePoem;
		this.showPoem = function() {
			var lineList = "<div>";
			lineList += this.poem.lines.join("</div><div>") + "</div>";
			return lineList;
		}
		this.submit = function() {
			if (this.newLine) {
          		this.poem.lines.push(this.newLine);
          		this.newLine = '';
        	}
		}
	});

	var samplePoem = {
		title: "Sample Poem",
		type: "Haiku",
		lines: ["this is a first line,", "But the second is best,", "and the third is last."]
	};
})();
