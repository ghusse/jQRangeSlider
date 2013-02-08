

(function(){
	"use strict";

	var ruled;

	var scale = {
		first: function(min){
			return Math.floor(min / 10) * 10;
		},
		next: function(previous){
			return previous + 10;
		},
		label: function(value){
			return value;
		}
	};

	var el = function(){return $("#test") };

	var ctorTest = new TestCase(
		"Ruler default ctor",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler();
		},
		function(){
			QUnit.ok(ruled.hasClass("ui-ruler"), "ui-ruler class should have been added");
			ruled.remove();
		}
	);

	var dtorTest = new TestCase(
		"Ruler destructor",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("destroy");
		},
		function(){
			QUnit.ok(!ruled.hasClass("ui-ruler"), "ui-ruler class should have been removed");
			QUnit.equal(ruled.find("*").length, 0, "destroy should empty the element");
			ruled.remove();
			ruled = null;
		}
	);

	var ctorWithOneScale = new TestCase(
		"Ctor with one scale",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 10,
				scales: [scale]
			});
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				step = scale.find(".ui-ruler-step"),
				label = step.find(".ui-ruler-step-label");

			QUnit.equal(scale.length, 1, "Should have created one scale");
			QUnit.equal(step.length, 1, "Should have created one step");
			QUnit.equal(label.length, 1, "Should have created one label");
			QUnit.equal(label.text(), "0", "Label text should be correct");
			QUnit.ok(scale.hasClass("ui-ruler-scale0"), "Class should have been initialized for first ruler");
			QUnit.ok(step.attr("style") && step.attr("style").indexOf("width: 100%") >= 0, "Width should be 100%: " + step.attr("style"));

			ruled.ruler("destroy");
			ruled.detach();
		}
	);

	var scaleStartingAfter = new TestCase(
		"Shifted scale starting after min",
		function(){
			ruled = $("<div />").appendTo(el());

			var shifted = $.extend({}, scale, {
				first: function(){
					return 10;
				}
			});

			ruled.ruler({
				min: 0,
				max: 20,
				scales: [shifted]
			});

		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				step = scale.find(".ui-ruler-step"),
				stepStyle = step.attr("style");

			QUnit.equal(step.length, 1, "Step should have been created");
			QUnit.ok(stepStyle.indexOf("width: 50%") >= 0, "Width should be 50% " + stepStyle);
			QUnit.ok(stepStyle.indexOf("margin-left: 50%") >= 0, "Margin-left should be 50% " + stepStyle);

			ruled.ruler("destroy");
			ruled.detach();
		}
	);

	var lastStep = new TestCase(
		"Last step should have been generated",
		function(){
			ruled = $("<div />").appendTo(el());

			ruled.ruler({
				min: 0,
				max: 25,
				scales: [scale]
			});
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				step = scale.find(".ui-ruler-step"),
				stepStyle = scale.find(".ui-ruler-step:last").attr("style");

			QUnit.equal(step.length, 3, "Last step should have been created");
			QUnit.ok(stepStyle.indexOf("width: 20%") >= 0, "Last step should be shrinked: " + stepStyle);

			ruled.remove();
		}
	);

	var stepStop = new TestCase(
		"tests test stop",
		function(){
			ruled = $("<div />").appendTo(el());

			var scaleStop = $.extend({}, scale, {
					stop: function(value){
						return value === 30;
					}
				});

			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scaleStop]
			});
		},
		function(){
			var scaleStop = ruled.find(".ui-ruler-scale"),
				steps = scaleStop.find(".ui-ruler-step");

			QUnit.equal(steps.length, 3, "Should have stopped on false");

			ruled.remove();
		});

	var setMinOption = new TestCase(
		"Set min option after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "min", 50);
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				steps = scale.find(".ui-ruler-step");
			
			QUnit.equal(steps.length, 5, "Ruler should have been regenerated");

			ruled.remove();
		});

	var setMaxOption = new TestCase(
		"Set max option after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "max", 60);
		},
		function(){
			var scale = ruled.find(".ui-ruler-scale"),
				steps = scale.find(".ui-ruler-step");
			
			QUnit.equal(steps.length, 6, "Ruler should have been regenerated");

			ruled.remove();
		});

	var setScalesOption = new TestCase(
		"Set scales options after construction",
		function(){
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: 0,
				max: 100,
				scales: [scale]
			});

			ruled.ruler("option", "scales", [scale, scale]);
		},
		function(){
			var scales = ruled.find(".ui-ruler-scale");

			QUnit.equal(scales.length, 2, "Ruler should have been regenerated");
			ruled.remove();
		});

	var dateRuler = new TestCase(
		"Ruler with dates",
		function(){
			var scale = {
				next: function(previous){
					var next = new Date(previous);
					return new Date(next.setDate(previous.getDate() + 2));
				},
				label: function(val){
					return val.toString();
				}
			}
			ruled = $("<div />").appendTo(el());
			ruled.ruler({
				min: new Date(2012, 0, 1),
				max: new Date(2012, 0, 6),
				scales: [scale]
			}); 
		},
		function(){
			var steps = ruled.find(".ui-ruler-step"),
				lastStep = ruled.find(".ui-ruler-step:last"),
				style = steps.attr("style"),
				lastStyle = lastStep.attr("style");

			QUnit.equal(steps.length, 3, "Steps should have been created, even with dates");
			QUnit.ok(style.indexOf("width: 40%") >= 0, "Steps should have been correctly dimensionned: " + style);
			QUnit.ok(lastStyle.indexOf("width: 20%") >= 0, "Last step should have been correctly shrinked: " + lastStyle);

			ruled.remove();
		});

	testRunner.add("ruler", [ctorTest, dtorTest,
		ctorWithOneScale,
		scaleStartingAfter,
		lastStep,
		stepStop,
		setMinOption, setMaxOption, setScalesOption,
		dateRuler]);
}());