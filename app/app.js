(function() {
	var app = angular.module('poemy', []);
	app.controller('PoemController', function() {
		this.poem = samplePoem;
		this.showPoem = function() {
			var lineList = "<div>";
			lineList += this.poem.lines.join("</div><div>") + "</div>";
			return lineList;
		}
		this.addLine = function() {
			if (this.newLine) {
          		this.poem.lines.push(this.newLine);
          		this.newLine = '';
        	}
		}
	});

	var samplePoems = [{
		title: "Sample Poem",
		type: "Haiku",
		lines: ["this is a first line,", "But the second is best,", "and the third is last."],
		complete: true
	}, {
		title: "Poem 2",
		type: "Haiku",
		lines: ['An old silent pond...', 'A frog jumps into the pond,'],
		complete: false
	}, {
		title: "Poem 3",
		type: "Haiku",
		lines: ["Light of the moon"],
		complete: false
	}, {
		title: "Poem 4",
		type: "Haiku",
		lines: ["A cricket disturbed", "the sleeping child; on the porch", "a man smoked and smiled."],
		complete: true
	}
	]}
})();